import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import { Input, Radio } from 'components/ui/Form';
import { StepWageringConfiguration } from './StepWageringConfiguration';
import { StepMaxCashoutConfiguration } from './StepMaxCashoutConfiguration';
import { VariableRulesEditor } from './VariableRulesEditor';
import { GameSelect } from './GameSelect';
import { useTranslation } from 'react-i18next';
import BonusTemplateService from 'services/bonus-template.services';
import CurrencyService from 'services/currency.services';
export function StepRewardDetails({
  data,
  onChange,
  bonusType,
  boostModeOptions,
  paymentMethodOptions,
  onRulesChange,
  onValidateRuleField,
  onGameOptionsCache,
  errors = {},
  wageringData,
  onWageringChange,
  wageringOptions,
  wageringBaseOptions,
  wageringErrors,
  mcoData,
  onMcoChange,
  mcoOptions,
  mcoBaseOptions,
  mcoErrors
}) {
  const { t } = useTranslation();
  // Denomination state/hooks must be declared at top-level to avoid conditional hooks
  const [denoms, setDenoms] = useState([]);
  const [denomsLoading, setDenomsLoading] = useState(false);
  const [denomsError, setDenomsError] = useState('');
  const [currencyMap, setCurrencyMap] = useState({});
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState('');
  const denominationChoiceKey = useMemo(
    () => data?.denominationChoiceKey || '',
    [data?.denominationChoiceKey]
  );

  useEffect(() => {
    if (bonusType !== 'free_spins') return;
    const dps = Number(data?.denominationPerSpin);
    if (!data?.denominationChoiceKey && [1, 2, 3].includes(dps)) {
      const key =
        dps === 1 ? 'FirstLowestValue' : dps === 2 ? 'SecondLowestValue' : 'ThirdLowestValue';
      onChange('denominationChoiceKey', key);
    }
  }, [bonusType, data?.denominationPerSpin, data?.denominationChoiceKey, onChange]);

  const denomRows = useMemo(() => {
    if (!Array.isArray(denoms) || denoms.length === 0) return [];
    return [
      ...denoms,
      { _isSelectRow: true, DenominationID: 'SELECT_ROW', CurrencyID: t('select') }
    ];
  }, [denoms, t]);

  const canSelectFirst = useMemo(
    () =>
      Array.isArray(denoms) &&
      denoms.length > 0 &&
      denoms.every((r) => r?.FirstLowestValue != null),
    [denoms]
  );
  const canSelectSecond = useMemo(
    () =>
      Array.isArray(denoms) &&
      denoms.length > 0 &&
      denoms.every((r) => r?.SecondLowestValue != null),
    [denoms]
  );
  const canSelectThird = useMemo(
    () =>
      Array.isArray(denoms) &&
      denoms.length > 0 &&
      denoms.every((r) => r?.ThirdLowestValue != null),
    [denoms]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setCurrencyLoading(true);
        setCurrencyError('');
        const res = await CurrencyService.getCurrencyList({
          pagination: { pageIndex: 0, pageSize: 1000 },
          filters: {}
        });
        if (cancelled) return;
        const list = res?.response?.data || res?.response?.Data || [];
        const map = Array.isArray(list)
          ? list.reduce((acc, item) => {
              const key = item?.CurrencyID ?? item?.id ?? item?.Id;
              const name = item?.CurrencyName ?? item?.name ?? item?.Name ?? item?.Code ?? '';
              if (key != null) acc[String(key)] = String(name || key);
              return acc;
            }, {})
          : {};
        setCurrencyMap(map);
      } catch (e) {
        if (!cancelled) setCurrencyError(e?.message || 'Failed to load currencies');
      } finally {
        if (!cancelled) setCurrencyLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderCurrencyName = (val) => {
    if (val == null) return '';
    const key = String(val);
    return currencyMap[key] || key;
  };

  const isCurrencyStatusReady = !currencyLoading && !currencyError;

  // Keep fixed/variable-exclusive fields mutually cleared
  useEffect(() => {
    if (bonusType !== 'deposit_boost') return;
    if (data.boostMode === 'fixed') {
      if (data.maxBonusAmount) onChange('maxBonusAmount', '');
      if (Array.isArray(data.variableRules) && data.variableRules.length > 0)
        onChange('variableRules', []);
    } else if (data.boostMode === 'variable') {
      if (data.boostPercent) onChange('boostPercent', '');
      if (data.minDepositAmount) onChange('minDepositAmount', '');
    }
    // we intentionally do not include variable fields (data.variableRules etc.) in deps to avoid infinite loops when clearing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bonusType, data.boostMode, onChange]);

  // Clear wagering days when wagering mode is none to avoid disabled field keeping stale value
  useEffect(() => {
    if (wageringData?.mode !== 'none') return;
    if (
      wageringData?.daysToWager !== '' &&
      wageringData?.daysToWager !== null &&
      wageringData?.daysToWager !== undefined
    ) {
      onWageringChange('daysToWager', '');
    }
  }, [wageringData?.mode, wageringData?.daysToWager, onWageringChange]);

  useEffect(() => {
    // Only fetch when free_spins context and a game is selected
    if (bonusType !== 'free_spins') return;
    const gameId = data?.gameId;
    setDenoms([]);
    setDenomsError('');
    if (!gameId) return;
    let cancelled = false;
    (async () => {
      try {
        setDenomsLoading(true);
        const { response } = await BonusTemplateService.getDenominations(gameId);
        if (!cancelled) {
          const items = response?.data || [];
          setDenoms(items);
          if (!data?.denominationChoiceKey && items.length > 0) {
            const dps = Number(data?.denominationPerSpin);
            const hasValidDps = [1, 2, 3].includes(dps);
            const preferredKey = hasValidDps
              ? dps === 1
                ? 'FirstLowestValue'
                : dps === 2
                  ? 'SecondLowestValue'
                  : 'ThirdLowestValue'
              : null;
            const canFirst = items.every((r) => r?.FirstLowestValue != null);
            const canSecond = items.every((r) => r?.SecondLowestValue != null);
            const canThird = items.every((r) => r?.ThirdLowestValue != null);
            const firstAvailableKey =
              (canFirst && 'FirstLowestValue') ||
              (canSecond && 'SecondLowestValue') ||
              (canThird && 'ThirdLowestValue') ||
              null;
            const finalKey =
              preferredKey &&
              ((preferredKey === 'FirstLowestValue' && canFirst) ||
                (preferredKey === 'SecondLowestValue' && canSecond) ||
                (preferredKey === 'ThirdLowestValue' && canThird))
                ? preferredKey
                : firstAvailableKey;
            if (finalKey) {
              onChange('denominationChoiceKey', finalKey);
              const num =
                finalKey === 'FirstLowestValue' ? 1 : finalKey === 'SecondLowestValue' ? 2 : 3;
              onChange('denominationPerSpin', num);
            }
          }
        }
      } catch (e) {
        if (!cancelled) setDenomsError(e?.message || 'Failed to load denominations');
      } finally {
        if (!cancelled) setDenomsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bonusType, data?.gameId, data?.denominationChoiceKey, data?.denominationPerSpin, onChange]);

  const handleSelectDenominationKey = (key) => {
    if (
      (key === 'FirstLowestValue' && !canSelectFirst) ||
      (key === 'SecondLowestValue' && !canSelectSecond) ||
      (key === 'ThirdLowestValue' && !canSelectThird)
    ) {
      return;
    }
    onChange('denominationChoiceKey', key);
    const num = key === 'FirstLowestValue' ? 1 : key === 'SecondLowestValue' ? 2 : 3;
    onChange('denominationPerSpin', num);
  };
  // Deposit Boost Configuration
  if (bonusType === 'deposit_boost') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">{t('boost_mode')}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {boostModeOptions.map((option) => (
              <Radio
                key={option.value}
                name="boostMode"
                label={option.label}
                value={option.value}
                checked={data.boostMode === option.value}
                onChange={(event) => onChange('boostMode', event.target.value)}
              />
            ))}
          </div>
          {errors.boostMode && (
            <p className="mt-2 text-sm text-error dark:text-error-light">{errors.boostMode}</p>
          )}
        </div>

        {data.boostMode === 'fixed' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t('boost_percentage')}
              type="number"
              placeholder={t('boost_percentage_placeholder')}
              value={data.boostPercent}
              onChange={(event) => onChange('boostPercent', event.target.value)}
              error={errors.boostPercent}
            />
            <Input
              label={t('minimum_deposit_amount')}
              type="number"
              placeholder={t('minimum_deposit_amount_placeholder')}
              value={data.minDepositAmount}
              onChange={(event) => onChange('minDepositAmount', event.target.value)}
              error={errors.minDepositAmount}
            />
          </div>
        )}

        {data.boostMode === 'variable' && (
          <div className="space-y-4">
            <Input
              label={t('max_bonus_amount')}
              type="any"
              placeholder={t('max_bonus_amount_placeholder')}
              value={data.maxBonusAmount}
              onChange={(event) => onChange('maxBonusAmount', event.target.value)}
              error={errors.maxBonusAmount}
            />
            <VariableRulesEditor
              rules={data.variableRules || []}
              onChange={onRulesChange}
              onValidateRuleField={onValidateRuleField}
              paymentMethodOptions={paymentMethodOptions}
              errors={errors}
            />
            {errors.variableRules && (
              <p className="mt-2 text-sm text-error dark:text-error-light">
                {errors.variableRules}
              </p>
            )}
          </div>
        )}

        {/* Wagering + Max Cashout: only for deposit_boost + variable mode */}
        {bonusType === 'deposit_boost' && data.boostMode === 'variable' && (
          <div className="space-y-6">
            <div className="rounded-md border p-4 dark:border-dark-500">
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-dark-100">
                {t('wagering_configuration')}
              </p>
              <StepWageringConfiguration
                data={wageringData}
                onChange={onWageringChange}
                options={wageringOptions}
                baseOptions={wageringBaseOptions}
                errors={wageringErrors || {}}
              />
            </div>
            <div className="rounded-md border p-4 dark:border-dark-500">
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-dark-100">
                {t('max_cashout_configuration')}
              </p>
              <StepMaxCashoutConfiguration
                data={mcoData}
                onChange={onMcoChange}
                options={mcoOptions}
                baseOptions={mcoBaseOptions}
                errors={mcoErrors || {}}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Free Chip Configuration
  if (bonusType === 'free_chip') {
    return (
      <div className="space-y-4">
        <Input
          label={t('chip_amount')}
          type="number"
          placeholder={t('chip_amount_placeholder')}
          value={data.amount}
          onChange={(event) => onChange('amount', event.target.value)}
          error={errors.amount}
        />
      </div>
    );
  }

  // Free Spins Configuration
  if (bonusType === 'free_spins') {
    return (
      <div className="space-y-4">
        <GameSelect
          value={data.selectedGame}
          onChange={(selected) => {
            onChange('gameId', selected?.value || ''),
              onChange('selectedGame', {
                value: selected?.value || '',
                label: selected?.label || ''
              });
            // Clear previously selected denomination when game changes
            onChange('selectedDenomination', undefined);
          }}
          placeholder={t('search_game_info')}
          error={errors.gameId}
          filters={{
            onlyFreeSpinSupport: 1
          }}
          onOptionsCache={onGameOptionsCache}
        />

        {/* Denominations selection applies to all rows */}
        {data?.gameId && (
          <div className="rounded-md border p-3 dark:border-dark-500">
            <p className="mb-2 text-sm font-medium text-gray-800 dark:text-dark-50">
              Denominations
            </p>
            {denomsLoading && (
              <p className="text-xs text-gray-500 dark:text-dark-300">Loading...</p>
            )}
            {denomsError && (
              <p className="text-xs text-error dark:text-error-light">{denomsError}</p>
            )}
            {!denomsLoading && !denomsError && (
              <div className="overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b dark:border-dark-600">
                      <th className="px-2 py-2">Currency</th>
                      <th className="px-2 py-2">First</th>
                      <th className="px-2 py-2">Second</th>
                      <th className="px-2 py-2">Third</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denomRows.map((row) => (
                      <tr
                        key={row.DenominationID}
                        className="border-b last:border-0 dark:border-dark-600">
                        <td className="px-2 py-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                              {row._isSelectRow
                                ? row.CurrencyID
                                : renderCurrencyName(row.CurrencyID)}
                            </span>
                            {!isCurrencyStatusReady && !row._isSelectRow && (
                              <span className="text-[10px] text-gray-500 dark:text-dark-300">
                                {currencyLoading ? 'Loading...' : currencyError}
                              </span>
                            )}
                          </div>
                        </td>
                        {row._isSelectRow ? (
                          <>
                            <td className="px-2 py-2">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="denomination-level"
                                  checked={denominationChoiceKey === 'FirstLowestValue'}
                                  disabled={!canSelectFirst}
                                  onChange={() => handleSelectDenominationKey('FirstLowestValue')}
                                />
                              </label>
                            </td>
                            <td className="px-2 py-2">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="denomination-level"
                                  checked={denominationChoiceKey === 'SecondLowestValue'}
                                  disabled={!canSelectSecond}
                                  onChange={() => handleSelectDenominationKey('SecondLowestValue')}
                                />
                              </label>
                            </td>
                            <td className="px-2 py-2">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="denomination-level"
                                  checked={denominationChoiceKey === 'ThirdLowestValue'}
                                  disabled={!canSelectThird}
                                  onChange={() => handleSelectDenominationKey('ThirdLowestValue')}
                                />
                              </label>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-2">{row.FirstLowestValue}</td>
                            <td className="px-2 py-2">{row.SecondLowestValue}</td>
                            <td className="px-2 py-2">{row.ThirdLowestValue}</td>
                          </>
                        )}
                      </tr>
                    ))}
                    {denoms.length === 0 && (
                      <tr>
                        <td
                          className="px-2 py-3 text-center text-xs text-gray-500 dark:text-dark-300"
                          colSpan={4}>
                          No denominations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('spins_count')}
            type="number"
            placeholder={t('spins_count_placeholder')}
            value={data.spinsCount}
            onChange={(event) => onChange('spinsCount', event.target.value)}
            error={errors.spinsCount}
          />
          {/** denomination_per_spin input is replaced by radio choice (1/2/3) */}
          {/**
          <Input
            label={t('denomination_per_spin')}
            type="number"
            placeholder={t('denomination_per_spin_placeholder')}
            value={data.denominationPerSpin}
            onChange={(event) => onChange('denominationPerSpin', event.target.value)}
            error={errors.denominationPerSpin}
          />
          */}
        </div>
        <Input
          label={t('max_free_spin_winnings')}
          type="number"
          placeholder={t('max_free_spin_winnings_placeholder')}
          value={data.maxFreeSpinWinnings}
          onChange={(event) => onChange('maxFreeSpinWinnings', event.target.value)}
          error={errors.maxFreeSpinWinnings}
        />
      </div>
    );
  }

  // Default: No bonus type selected
  return (
    <div className="text-center text-gray-500 dark:text-dark-200">
      {t('please_select_bonus_type_info')}
    </div>
  );
}

StepRewardDetails.propTypes = {
  data: PropTypes.shape({
    boostMode: PropTypes.string,
    boostPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minDepositAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxBonusAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variableRules: PropTypes.array,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    spinsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denominationPerSpin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxFreeSpinWinnings: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  bonusType: PropTypes.string,
  boostModeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  paymentMethodOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onRulesChange: PropTypes.func,
  onValidateRuleField: PropTypes.func,
  onGameOptionsCache: PropTypes.func,
  errors: PropTypes.object
};
