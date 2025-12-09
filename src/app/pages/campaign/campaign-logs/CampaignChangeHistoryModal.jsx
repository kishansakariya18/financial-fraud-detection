import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom/CustomModal';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { Badge } from 'components/ui';
import { campaignStatusToAPP } from '../helper';

const prettifyKey = (key) => {
  if (!key) return '';
  const withSpaces = String(key)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

const CampaignDataDisplay = ({ data }) => {
  if (!data || Object.keys(data).length === 0)
    return <div className="text-sm italic text-gray-500">No data</div>;

  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col border-b border-gray-100 pb-2 last:border-0 dark:border-dark-600">
          <span className="text-xs font-semibold text-gray-500 dark:text-dark-300">
            {prettifyKey(key)}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
            {formatValue(key, value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Helper to format values based on key
const formatValue = (key, value) => {
  if (value === null || value === undefined) return '—';
  if (key === 'Status') {
    const status = campaignStatusToAPP(value);
    return (
      <Badge color={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'}>
        {typeof status === 'string' && status.length
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : status}
      </Badge>
    );
  }
  if (key.includes('Date') || key.includes('At') || key.includes('Time')) {
    return getDateInUTCToTimeZone(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

// A generic change history modal for Campaigns that shows side-by-side comparison
// of old vs new data (pretty-printed JSON when objects are provided)
const CampaignChangeHistoryModal = ({ isOpen, onClose, changeData }) => {
  const { t } = useTranslation();

  if (!changeData) return null;

  const titleName =
    changeData.CampaignName || changeData.campaignName || changeData.Name || changeData.name || '';
  const actionType = changeData.Action || changeData.action || changeData.ChangeType || '-';
  const changedBy = changeData.AdminName || changeData.adminName || changeData.user || '—';

  // Try to detect old/new payloads from common keys
  const newPayload =
    changeData.NewValues ||
    changeData.NewData ||
    changeData.newData ||
    changeData.New ||
    changeData.new ||
    changeData.After ||
    changeData.after ||
    null;
  const oldPayload =
    changeData.OldValues ||
    changeData.OldData ||
    changeData.oldData ||
    changeData.Old ||
    changeData.old ||
    changeData.Before ||
    changeData.before ||
    null;

  return (
    <CustomModal
      show={isOpen}
      onClose={onClose}
      title={`${t('change_history')}${titleName ? ` - ${titleName}` : ''} (v${changeData.Version})`}
      sizeClass="max-w-6xl">
      <div className="space-y-4">
        {/* Change Info */}
        <div className="grid gap-4 rounded-lg bg-gray-50 p-4 dark:bg-dark-700/40 md:grid-cols-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('changed_by')}
            </div>
            <div className="text-sm font-medium">{changedBy}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('effective_from')}
            </div>
            <div className="text-sm font-medium">
              {changeData.EffectiveFrom ? getDateInUTCToTimeZone(changeData.EffectiveFrom) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('effective_to')}
            </div>
            <div className="text-sm font-medium">
              {changeData.EffectiveTo ? getDateInUTCToTimeZone(changeData.EffectiveTo) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('change_type')}
            </div>
            <div className="text-sm font-medium">{actionType}</div>
          </div>
        </div>

        {/* Rules Comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* New Values */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('new_values')}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
              <CampaignDataDisplay data={newPayload} />
            </div>
          </div>
          {/* Old Values */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('old_values')}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
              <CampaignDataDisplay data={oldPayload} />
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default CampaignChangeHistoryModal;
