import { useEffect, useRef, useState, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import moment from 'moment-timezone';
import { Button, Input, Checkbox, Textarea } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import PlayerSegmentationService from 'services/player-segmentation.services';
import RuleBuilder from './RuleBuilder';
import { createDefaultRuleTree, processRuleTree } from './ruleUtils';
import { getAttribute } from './attributeRegistry';
import { playerSegmentationSchema, playerSegmentationEditSchema } from './validationSchema';
import PlayerListModal from './PlayerListModal';

const evaluationFrequencyOptions = [
  { value: 'NONE', label: 'None' },
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' }
];

const transformToUTC = (condition) => {
  const attribute = getAttribute(condition.field);
  if (attribute?.dataType === 'datetime' && condition.value) {
    const transformValue = (val) => {
      if (!val) return val;
      return moment(val).utc().format();
    };

    if (Array.isArray(condition.value)) {
      return { ...condition, value: condition.value.map(transformValue) };
    } else if (typeof condition.value === 'string') {
      return { ...condition, value: transformValue(condition.value) };
    }
  }
  return condition;
};

const transformToLocal = (condition) => {
  const attribute = getAttribute(condition.field);
  if (attribute?.dataType === 'datetime' && condition.value) {
    const transformValue = (val) => {
      if (!val) return val;
      return moment.utc(val).local().format('YYYY-MM-DDTHH:mm');
    };

    if (Array.isArray(condition.value)) {
      return { ...condition, value: condition.value.map(transformValue) };
    } else if (typeof condition.value === 'string') {
      return { ...condition, value: transformValue(condition.value) };
    }
  }
  return condition;
};

const CreateOrEditFormPlayerSegmentation = ({
  mode = 'create',
  initialData = null,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const initialValuesRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const isEditMode = mode === 'edit' && initialData;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(isEditMode ? playerSegmentationEditSchema : playerSegmentationSchema),
    defaultValues: {
      segmentName: '',
      segmentDescription: '',
      segmentTag: '',
      segmentRules: createDefaultRuleTree(),
      isScheduled: true,
      evaluationFrequency: 'DAILY',
      ...(isEditMode && { segmentationUID: '' })
    }
  });

  const isScheduled = watch('isScheduled');
  const segmentRules = watch('segmentRules');
  const evaluationFrequency = watch('evaluationFrequency');

  // Helper function to get next update message based on frequency
  const getNextUpdateMessage = (frequency) => {
    switch (frequency) {
      case 'HOURLY':
        return t('segmentation_update_hourly');
      case 'DAILY':
        return t('segmentation_update_daily');
      case 'WEEKLY':
        return t('segmentation_update_sunday');
      case 'MONTHLY':
        return t('segmentation_update_monthly');
      case 'NONE':
        return t('segmentation_no_scheduled');
      default:
        return t('segmentation_select_frequency');
    }
  };

  // Load initial data for edit mode
  useEffect(() => {
    let initialValues;
    if (isEditMode && initialData) {
      const rules = initialData.segmentRules || initialData.SegmentRules || createDefaultRuleTree();
      // Convert UTC dates to local time for display
      const segmentRules = processRuleTree(rules, transformToLocal);

      initialValues = {
        segmentationUID: initialData.segmentationUID || initialData.SegmentationUID,
        segmentName: initialData.segmentName || initialData.SegmentName || '',
        segmentDescription: initialData.segmentDescription || initialData.SegmentDescription || '',
        segmentTag: initialData.segmentTag || initialData.SegmentTag || '',
        segmentRules: segmentRules,
        isScheduled:
          initialData.isScheduled !== undefined
            ? initialData.isScheduled
            : initialData.IsScheduled === 1,
        evaluationFrequency:
          initialData.evaluationFrequency || initialData.EvaluationFrequency || 'DAILY'
      };
    } else {
      initialValues = {
        segmentName: '',
        segmentDescription: '',
        segmentTag: '',
        segmentRules: createDefaultRuleTree(),
        isScheduled: true,
        evaluationFrequency: 'DAILY'
      };
    }

    // Store initial values for reset functionality
    initialValuesRef.current = initialValues;
    reset(initialValues);
  }, [initialData, isEditMode, reset]);

  const handleReset = () => {
    if (initialValuesRef.current) {
      reset(initialValuesRef.current);
    }
  };

  const onSubmit = async (data) => {
    // Convert local dates to UTC for API
    const segmentRules = processRuleTree(data.segmentRules, transformToUTC);

    const request = {
      SegmentationUID: data.segmentationUID || null,
      SegmentName: data.segmentName,
      SegmentDescription: data.segmentDescription,
      SegmentTag: data.segmentTag,
      SegmentRules: segmentRules,
      ...(data.isScheduled !== undefined && { IsScheduled: data.isScheduled ? 1 : 0 }),
      ...(data.isActive !== undefined && { IsActive: data.isActive ? 1 : 0 }),
      ...(data.evaluationFrequency && {
        EvaluationFrequency: data.isScheduled ? data.evaluationFrequency : 'NONE'
      })
    };
    let res;
    if (isEditMode) {
      res = PlayerSegmentationService.edit(request);
    } else {
      res = PlayerSegmentationService.add(request);
    }
    await res
      .then(({ response }) => {
        toast.success(response?.message);
        onSuccess?.(response?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  // Memoize UTC rules for preview to avoid unnecessary re-renders
  const previewRules = useMemo(() => {
    return processRuleTree(segmentRules, transformToUTC);
  }, [segmentRules]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="segmentName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={t('segment_name') + ' *'}
                  placeholder={t('enter') + ' ' + t('segment_name')}
                  error={errors?.segmentName?.message}
                />
              )}
            />

            <Controller
              name="segmentTag"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={t('segment_tag')}
                  placeholder={t('enter') + ' ' + t('segment_tag')}
                  error={errors?.segmentTag?.message}
                />
              )}
            />
          </div>

          <Controller
            name="isScheduled"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                label={t('enable') + ' ' + t('scheduled') + ' ' + t('evaluation')}
              />
            )}
          />

          {isScheduled && (
            <div className="space-y-2">
              <Controller
                name="evaluationFrequency"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={evaluationFrequencyOptions}
                    value={
                      evaluationFrequencyOptions.find((opt) => opt.value === field.value) || null
                    }
                    onChange={(opt) => field.onChange(opt.value)}
                    label={t('evaluation_frequency') + ' *'}
                    placeholder={t('select') + ' ' + t('frequency')}
                    displayField="label"
                    error={errors?.evaluationFrequency?.message}
                  />
                )}
              />
              <p className="text-xs text-gray-500 dark:text-dark-300">
                {getNextUpdateMessage(evaluationFrequency)}
              </p>
            </div>
          )}
        </div>
        <div>
          <Controller
            name="segmentDescription"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                rows={4}
                label={t('segment_description')}
                placeholder={t('enter') + ' ' + t('segment_description')}
                error={errors?.segmentDescription?.message}
              />
            )}
          />
        </div>

        {/* Rule Builder */}
        <div className="space-y-4">
          <Controller
            name="segmentRules"
            control={control}
            render={({ field }) => (
              <RuleBuilder
                value={field.value}
                onChange={field.onChange}
                error={errors?.segmentRules?.message || errors?.segmentRules}
              />
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-dark-500">
          <Button onClick={onCancel} type="button" disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button onClick={handleReset} color="warning" type="button" disabled={isSubmitting}>
            {t('reset')}
          </Button>
          <Button
            onClick={() => setIsPreviewModalOpen(true)}
            color="info"
            type="button"
            disabled={isSubmitting}>
            {t('player_preview')}
          </Button>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {isSubmitting ? t('saving') + '...' : isEditMode ? t('update') : t('create')}
          </Button>
        </div>
      </form>

      <PlayerListModal
        isOpen={isPreviewModalOpen}
        segmentRules={previewRules}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </>
  );
};

export default CreateOrEditFormPlayerSegmentation;
