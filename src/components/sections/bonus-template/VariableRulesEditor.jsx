import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components/ui';
import { Input, Select } from 'components/ui/Form';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';

const inputClassNames = {
  root: 'w-full',
  wrapper: 'mt-0',
  label: 'sr-only',
  input: 'h-9 text-xs'
};

const defaultRule = {
  paymentMethod: 'all',
  rangeFrom: '',
  rangeTo: '',
  boostPercent: '',
  wagering: '',
  mco: ''
};

export function VariableRulesEditor({
  rules,
  onChange,
  onValidateRuleField,
  paymentMethodOptions,
  errors = {}
}) {
  const { t } = useTranslation();
  const [localRules, setLocalRules] = useState(rules || []);
  const previousRulesJsonRef = useRef(JSON.stringify(rules || []));
  const isInternalUpdateRef = useRef(false);

  // Helper function to get error message from bracket notation path
  // e.g., "variableRules[0].rangeTo" -> errors["variableRules[0].rangeTo"]
  const getFieldError = useCallback(
    (index, field) => {
      if (!errors || typeof errors !== 'object') return undefined;

      // Try bracket notation first (e.g., "variableRules[0].rangeTo")
      const bracketPath = `variableRules[${index}].${field}`;
      if (errors[bracketPath]) {
        return errors[bracketPath];
      }

      // Try nested object notation (e.g., errors.variableRules[0].rangeTo)
      if (errors.variableRules && Array.isArray(errors.variableRules)) {
        const ruleError = errors.variableRules[index];
        if (ruleError && ruleError[field]) {
          return ruleError[field];
        }
      }

      return undefined;
    },
    [errors]
  );

  // Collect all error messages for a row (rule)
  const getRowErrors = useCallback(
    (index) => {
      const fields = ['paymentMethod', 'rangeFrom', 'rangeTo', 'boostPercent', 'wagering', 'mco'];
      const msgs = fields
        .map((f) => getFieldError(index, f))
        .filter((msg) => typeof msg === 'string' && msg.trim().length > 0);
      // Deduplicate while keeping order
      return [...new Set(msgs)];
    },
    [getFieldError]
  );

  // allow only first row form to edit other disbale , payment method wise
  const isDisabledFormField = useCallback(
    (index) => {
      const currentRule = localRules[index];
      const paymentMethod = currentRule.paymentMethod || 'all';
      const samePaymentMethodRules = localRules
        .map((rule, idx) => ({ ...rule, index: idx }))
        .filter(
          (rule, idx) => (rule.paymentMethod || 'all') === (paymentMethod || 'all') && idx < index
        );

      return samePaymentMethodRules.length > 0;
    },
    [localRules]
  );

  // Sync external rules to local state
  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    const incomingJson = JSON.stringify(rules || []);
    const hasChanged = incomingJson !== previousRulesJsonRef.current;

    if (hasChanged) {
      previousRulesJsonRef.current = incomingJson;
      setLocalRules(rules && rules.length > 0 ? rules : []);
    }
  }, [rules]);

  // Helper function to get the previous rule's rangeTo for the same payment method
  const getPreviousRangeTo = useCallback(
    (paymentMethod, currentIndex) => {
      if (!localRules || localRules.length === 0) return null;

      // Get all rules with the same payment method, excluding current index
      const samePaymentMethodRules = localRules
        .map((rule, idx) => ({ ...rule, index: idx }))
        .filter(
          (rule, idx) =>
            (rule.paymentMethod || 'all') === (paymentMethod || 'all') && idx !== currentIndex
        );

      if (samePaymentMethodRules.length === 0) return null;

      // Sort by rangeFrom to find the last range
      const sortedRules = [...samePaymentMethodRules].sort((a, b) => {
        const aFrom = Number(a.rangeFrom) || 0;
        const bFrom = Number(b.rangeFrom) || 0;
        return aFrom - bFrom;
      });

      // Get the last rule's rangeTo (the one that should connect to current rule)
      const lastRule = sortedRules[sortedRules.length - 1];
      const lastRangeTo = Number(lastRule.rangeTo);

      return !isNaN(lastRangeTo) && lastRangeTo !== null && lastRangeTo !== undefined
        ? lastRangeTo
        : null;
    },
    [localRules]
  );

  // Update a rule field and handle auto-fill logic
  const updateRuleField = useCallback(
    async (index, field, value) => {
      const updatedRules = [...localRules];
      const currentRule = { ...updatedRules[index] };
      currentRule[field] = value;
      updatedRules[index] = currentRule;

      // Handle auto-fill logic based on field type
      if (field === 'rangeTo') {
        // When rangeTo changes, update the next rule's rangeFrom if same payment method
        const paymentMethod = currentRule.paymentMethod || 'all';
        const nextRuleIndex = updatedRules.findIndex(
          (rule, idx) => idx > index && (rule.paymentMethod || 'all') === paymentMethod
        );

        if (nextRuleIndex !== -1) {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue !== null && numValue !== undefined) {
            updatedRules[nextRuleIndex] = {
              ...updatedRules[nextRuleIndex],
              rangeFrom: numValue
            };
          }
        }
      } else if (field === 'paymentMethod') {
        // When payment method changes, auto-fill rangeFrom from previous rule with same payment method
        const previousRangeTo = getPreviousRangeTo(value, index);
        if (previousRangeTo !== null) {
          currentRule.rangeFrom = previousRangeTo;
          updatedRules[index] = currentRule;
        }
      }

      setLocalRules(updatedRules);
      isInternalUpdateRef.current = true;
      previousRulesJsonRef.current = JSON.stringify(updatedRules);
      onChange(updatedRules);

      // Validate the field that changed and update errors incrementally
      if (onValidateRuleField) {
        await onValidateRuleField(updatedRules);
      }
    },
    [localRules, getPreviousRangeTo, onChange, onValidateRuleField]
  );

  const handleAddRule = () => {
    const newRule = {
      ...defaultRule,
      id: Date.now().toString()
    };

    // Check if there's a previous rule with the same payment method to auto-fill rangeFrom
    const lastRuleWithSamePayment = localRules
      .filter((rule) => (rule?.paymentMethod || 'all') === (newRule.paymentMethod || 'all'))
      .sort((a, b) => {
        const aFrom = Number(a.rangeFrom) || 0;
        const bFrom = Number(b.rangeFrom) || 0;
        return aFrom - bFrom;
      })
      .pop();

    if (lastRuleWithSamePayment) {
      const lastRangeTo = Number(lastRuleWithSamePayment.rangeTo);
      if (!isNaN(lastRangeTo) && lastRangeTo !== null && lastRangeTo !== undefined) {
        newRule.rangeFrom = lastRangeTo;
      }
    }

    const updatedRules = [...localRules, newRule];
    setLocalRules(updatedRules);
    isInternalUpdateRef.current = true;
    previousRulesJsonRef.current = JSON.stringify(updatedRules);
    onChange(updatedRules);
  };

  const handleDeleteRule = (index) => {
    const updatedRules = localRules.filter((_, idx) => idx !== index);
    setLocalRules(updatedRules);
    isInternalUpdateRef.current = true;
    previousRulesJsonRef.current = JSON.stringify(updatedRules);
    onChange(updatedRules);
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-dark-50">
          {t('variable_rules')}
        </h4>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-500">
        <div>
          <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-dark-500">
            <thead className="bg-gray-50 dark:bg-dark-700/40">
              <tr className="text-left font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                <th className="px-3 py-2">{t('payment_method')}</th>
                <th className="px-3 py-2">{t('min_deposit')}</th>
                <th className="px-3 py-2">{t('max_deposit')}</th>
                <th className="px-3 py-2">{t('boost_percentage')}</th>
                <th className="px-3 py-2">{t('wagering')}</th>
                <th className="px-3 py-2">{t('max_cashout')}</th>
                <th className="px-3 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-500">
              {localRules.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-gray-500 dark:text-dark-200">
                    {t('no_variable_rules_added_yet')}
                  </td>
                </tr>
              ) : (
                localRules.map((rule, index) => {
                  const rowErrors = getRowErrors(index);
                  const hasErrors = rowErrors.length > 0;
                  return (
                    <>
                      <tr
                        key={(rule.id || `rule-${index}`) + '-row'}
                        className={`bg-white text-gray-700 dark:bg-dark-700 dark:text-dark-100 ${hasErrors ? 'ring-1 ring-error/30 dark:ring-error/40' : ''}`}>
                        <td className="px-3 py-2">
                          <Select
                            label={t('payment_method')}
                            data={paymentMethodOptions}
                            value={rule.paymentMethod || 'all'}
                            onChange={(e) =>
                              updateRuleField(index, 'paymentMethod', e.target.value)
                            }
                            classNames={{ ...inputClassNames, select: 'h-9 text-xs' }}
                            error={getFieldError(index, 'paymentMethod')}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            label={t('min_deposit')}
                            type="number"
                            value={rule.rangeFrom || ''}
                            disabled={isDisabledFormField(index)}
                            onChange={(e) => updateRuleField(index, 'rangeFrom', e.target.value)}
                            classNames={inputClassNames}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            label={t('max_deposit')}
                            type="number"
                            value={rule.rangeTo || ''}
                            onChange={(e) => updateRuleField(index, 'rangeTo', e.target.value)}
                            classNames={inputClassNames}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            label={t('boost_percentage')}
                            type="number"
                            value={rule.boostPercent || ''}
                            onChange={(e) => updateRuleField(index, 'boostPercent', e.target.value)}
                            classNames={inputClassNames}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            label={t('wagering')}
                            type="number"
                            value={rule.wagering || ''}
                            onChange={(e) => updateRuleField(index, 'wagering', e.target.value)}
                            classNames={inputClassNames}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            label={t('max_cashout')}
                            type="number"
                            value={rule.mco || ''}
                            onChange={(e) => updateRuleField(index, 'mco', e.target.value)}
                            classNames={inputClassNames}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              isIcon
                              variant="flat"
                              color="error"
                              className="size-8"
                              onClick={() => handleDeleteRule(index)}>
                              <TrashIcon className="size-4.5 stroke-1" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {hasErrors && (
                        <tr key={(rule.id || `rule-${index}`) + '-errors'}>
                          <td colSpan={7} className="bg-error/5 px-3 py-2">
                            <div className="text-[11px] leading-5 text-error dark:text-error-light">
                              {rowErrors.join(' • ')}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" color="primary" className="h-9 px-4 text-xs" onClick={handleAddRule}>
          {t('add_rule')}
        </Button>
      </div>
    </div>
  );
}

VariableRulesEditor.propTypes = {
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      paymentMethod: PropTypes.string,
      rangeFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rangeTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      boostPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      wagering: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mco: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onValidateRuleField: PropTypes.func,
  paymentMethodOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  errors: PropTypes.object
};
