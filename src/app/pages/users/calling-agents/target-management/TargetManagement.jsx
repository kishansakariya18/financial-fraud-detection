import { useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { PlusIcon } from '@heroicons/react/24/outline';
import TargetForm from './components/TargetForm';
import TargetsList from './components/TargetsList';
import { useAgentTargets } from './hooks/useAgentTargets';
import { ConfirmModal } from 'components/shared/ConfirmModal';

// Event options to check against for disabling create button
const eventOptions = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'wager', label: 'Wager' },
  { value: 'loss', label: 'Loss' }
];

const TargetManagement = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const pageTitle = t('target_management');
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const { loading, targets, fetchTargets, createTarget, deleteTarget } = useAgentTargets(
    agentUID,
    t
  );

  const handleDeleteOpenConfirmModal = async (target) => {
    setDeleteModalOpen(target);
    setDeleteError(false);
    setDeleteSuccess(false);
    // await deleteTarget(target);
  };

  const handleDelete = async () => {
    setConfirmDeleteLoading(true);
    await deleteTarget(deleteModalOpen)
      .then(() => {
        setDeleteSuccess(true);
        fetchTargets();
      })
      .catch(() => {
        setDeleteError(true);
      })
      .finally(() => {
        setConfirmDeleteLoading(false);
      });
  };

  const handleSubmit = async (data) => {
    const result = await createTarget(data);

    if (result.success) {
      setShowForm(false);
    }
    return result; // Pass result back to form for error handling
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <div className="mx-auto w-full space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100">{pageTitle}</h3>
          </div>
          {targets && (
            <Button
              onClick={() => setShowForm(true)}
              className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
              color="primary"
              disabled={targets?.length >= 3 || targets?.length >= eventOptions.length}>
              <PlusIcon className="size-4" />
              <span>{t('target_create')}</span>
            </Button>
          )}
        </div>

        {showForm && (
          <TargetForm
            t={t}
            title={t('target_create')}
            existingTargets={targets}
            loading={loading}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">
            Existing Targets ({targets?.length || 0}/3)
          </h4>
          <TargetsList
            t={t}
            targets={targets}
            loading={loading}
            onCreateNew={() => setShowForm(true)}
            onDelete={handleDeleteOpenConfirmModal}
          />
        </div>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(null)}
        messages={{
          pending: {
            description: t('confirm_delete_target'),
            actionText: t('submit')
          },
          success: {
            title: t('target') + ' ' + t('delete_text'),
            description: t('target_deleted_successfully')
          }
        }}
        onOk={handleDelete}
        confirmLoading={confirmDeleteLoading}
        state={deleteError ? 'error' : deleteSuccess ? 'success' : 'pending'}
      />
    </ContentWrapper>
  );
};

export default TargetManagement;
