import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom/CustomModal';
import { RuleTreeDisplay } from './RuleTreeDisplay';
import { useSegmentationMappings } from './useSegmentationMappings';
import { extractPlayerIdsFromRuleTree } from './ruleUtils';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const ChangeHistoryModal = ({ isOpen, onClose, changeData }) => {
  const { t } = useTranslation();

  // Extract player IDs from both new and old rules (memoized)
  const playerIds = useMemo(() => {
    const newRulesPlayerIds = changeData?.NewRules
      ? extractPlayerIdsFromRuleTree(changeData.NewRules)
      : [];
    const oldRulesPlayerIds = changeData?.OldRules
      ? extractPlayerIdsFromRuleTree(changeData.OldRules)
      : [];
    const ids = [...new Set([...newRulesPlayerIds, ...oldRulesPlayerIds])];
    return ids;
  }, [changeData?.NewRules, changeData?.OldRules]);

  // Use the custom hook to fetch and cache mapping data
  const { countryMap, currencyMap, affiliateMap, playerOptions } = useSegmentationMappings({
    fetchCountries: true,
    fetchCurrencies: true,
    fetchAffiliates: true,
    playerIds: playerIds // Fetch player details for display
  });

  // Create playerMap from playerOptions (memoized)
  const playerMap = useMemo(() => {
    const map = {};
    playerOptions.forEach((player) => {
      map[player.value] = player.label;
    });
    return map;
  }, [playerOptions]);

  if (!changeData) return null;

  return (
    <CustomModal
      show={isOpen}
      onClose={onClose}
      title={`${t('change_history')} - ${changeData.SegmentName} (v${changeData.Version})`}
      sizeClass="max-w-7xl">
      <div className="space-y-4">
        {/* Change Info */}
        <div className="grid gap-4 rounded-lg bg-gray-50 p-4 dark:bg-dark-700/40 md:grid-cols-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">
              {t('changed_by')}
            </div>
            <div className="text-sm font-medium">{changeData.ChangedBy || '—'}</div>
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
            <div className="text-sm font-medium">{changeData.ChangeType}</div>
          </div>
        </div>

        {/* Rules Comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* New Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('new_rules')} {changeData.ChangeType === 'DELETED' && '(Segment Deleted)'}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
              {changeData.NewRules && changeData.ChangeType !== 'DELETED' ? (
                <RuleTreeDisplay
                  node={changeData.NewRules}
                  affiliateMap={affiliateMap}
                  countryMap={countryMap}
                  currencyMap={currencyMap}
                  playerMap={playerMap}
                />
              ) : (
                <div className="text-sm italic text-gray-500 dark:text-dark-300">
                  {changeData.ChangeType === 'DELETED' ? 'Segment was deleted' : 'No new rules'}
                </div>
              )}
            </div>
          </div>
          {/* Old Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
              {t('old_rules')}
            </h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
              {changeData.OldRules && changeData.ChangeType !== 'CREATED' ? (
                <RuleTreeDisplay
                  node={changeData.OldRules}
                  countryMap={countryMap}
                  affiliateMap={affiliateMap}
                  currencyMap={currencyMap}
                  playerMap={playerMap}
                />
              ) : (
                <div className="text-sm italic text-gray-500 dark:text-dark-300">
                  {changeData.ChangeType === 'CREATED'
                    ? t('new_segment_created')
                    : t('no_old_rules')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ChangeHistoryModal;
