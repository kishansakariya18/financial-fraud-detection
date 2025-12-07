import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom/CustomModal';
import { getDateInUTCToTimeZone } from 'helpers/functions';

// A generic change history modal for Campaigns that shows side-by-side comparison
// of old vs new data (pretty-printed JSON when objects are provided)
const CampaignChangeHistoryModal = ({ isOpen, onClose, changeData }) => {
  const { t } = useTranslation();

  if (!changeData) return null;

  const titleName =
    changeData.CampaignName || changeData.campaignName || changeData.Name || changeData.name || '';
  const actionType = changeData.Action || changeData.action || changeData.ChangeType || '-';
  const changedBy = changeData.AdminName || changeData.adminName || changeData.user || '—';
  const changedAt =
    changeData.CreatedAt || changeData.createdAt || changeData.timestamp || changeData.UpdatedAt;

  // Try to detect old/new payloads from common keys
  const newPayload =
    changeData.NewData ||
    changeData.newData ||
    changeData.New ||
    changeData.new ||
    changeData.After ||
    changeData.after ||
    null;
  const oldPayload =
    changeData.OldData ||
    changeData.oldData ||
    changeData.Old ||
    changeData.old ||
    changeData.Before ||
    changeData.before ||
    null;

  const stringify = (val) => {
    try {
      if (val == null) return null;
      if (typeof val === 'string') return val;
      return JSON.stringify(val, null, 2);
    } catch (e) {
      console.error('Error stringifying value:', e);
      return String(val);
    }
  };

  const newString = stringify(newPayload);
  const oldString = stringify(oldPayload);

  return (
    <CustomModal
      show={isOpen}
      onClose={onClose}
      title={`${t('change_history')}${titleName ? ` - ${titleName}` : ''}`}
      sizeClass="max-w-6xl">
      <div className="space-y-4">
        {/* Change Info */}
        <div className="grid gap-4 rounded-lg bg-gray-50 p-4 dark:bg-dark-700/40 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('changed_by')}
            </div>
            <div className="text-sm font-medium">{changedBy}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('date') || 'Date'}
            </div>
            <div className="text-sm font-medium">
              {changedAt ? getDateInUTCToTimeZone(changedAt) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('change_type')}
            </div>
            <div className="text-sm font-medium">{actionType}</div>
          </div>
        </div>

        {/* Data Comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* New Data */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('new_data') || t('new_rules') || 'New'}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
              {newString ? (
                <pre className="max-h-96 overflow-auto text-xs leading-relaxed text-gray-800 dark:text-dark-50">
                  {newString}
                </pre>
              ) : (
                <div className="text-sm italic text-gray-500 dark:text-dark-300">
                  {t('no_new_data') || 'No new data'}
                </div>
              )}
            </div>
          </div>

          {/* Old Data */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('old_data') || t('old_rules') || 'Old'}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
              {oldString ? (
                <pre className="max-h-96 overflow-auto text-xs leading-relaxed text-gray-800 dark:text-dark-50">
                  {oldString}
                </pre>
              ) : (
                <div className="text-sm italic text-gray-500 dark:text-dark-300">
                  {t('no_old_data') || t('no_old_rules') || 'No old data'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default CampaignChangeHistoryModal;
