import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AgentService from 'services/agent.services';

// Transform API response to UI format
export const transformApiResponseToUI = (apiTargets) => {
  if (!Array.isArray(apiTargets)) return [];

  return apiTargets.map((target) => ({
    id: target.id || target.targetId,
    targetName: target.targetName,
    eventName: target.eventName,
    effectiveFrom: target.effectiveFrom,
    effectiveTo: target.effectiveTo,
    isActive: target.isActive,
    ranges: target.ranges || []
  }));
};

// Transform UI data to API format
export const transformUIDataToAPI = (formData) => ({
  targetName: formData.targetName,
  eventName: formData.eventName,
  targets: formData.ranges.map((range, index) => ({
    rangeNo: index + 1,
    rangeMin: parseFloat(range.rangeMin) || 0,
    rangeMax: range.rangeMax === null || range.rangeMax === '' ? null : parseFloat(range.rangeMax),
    commissionRate: parseFloat(range.commissionRate) || 0
  }))
});

// Helper function to get used event types
export const getUsedEventTypes = (targets, editingTarget = null) => {
  if (!Array.isArray(targets)) return [];

  return targets
    .filter((target) => (editingTarget ? target.id !== editingTarget.id : true))
    .map((target) => target.eventName);
};

export const useAgentTargets = (agentUID, t) => {
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState(null);

  console.log('targets', targets);

  const fetchTargets = useCallback(async () => {
    if (!agentUID) return;
    setLoading(true);
    await AgentService.getCommissionTargets(agentUID)
      .then(({ response }) => {
        if (response) {
          setTargets(transformApiResponseToUI(response.data.targets));
        } else {
          setTargets([]);
        }
      })
      .catch((error) => {
        toast.error(error || 'Failed to fetch targets');
        setTargets(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [agentUID]);

  const createTarget = useCallback(
    async (formData) => {
      if (!agentUID) return { success: false, error: 'Agent ID is required' };
      setLoading(true);

      const payload = transformUIDataToAPI(formData);
      return AgentService.createCommissionTarget(agentUID, payload)
        .then(async () => {
          toast.success(t('target_created_successfully'));
          await fetchTargets();
          return { success: true };
        })
        .catch((err) => {
          toast.error(err.message || err || 'Failed to create target');
          return {
            success: false,
            error: err.message || err || 'Failed to create target',
            formError: err.response?.data?.message || err.message
          };
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [agentUID, fetchTargets, t]
  );

  const deleteTarget = useCallback(
    async (target) => {
      if (!agentUID) return;
      return AgentService.deleteCommissionTarget(agentUID, {
        targetName: target.targetName,
        eventName: target.eventName
      });
    },
    [agentUID]
  );

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  return {
    loading,
    targets,
    fetchTargets,
    createTarget,
    deleteTarget
  };
};
