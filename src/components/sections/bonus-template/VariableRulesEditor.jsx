import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Button } from 'components/ui';
import { Input, Select } from 'components/ui/Form';
import { useTranslation } from 'react-i18next';
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

// Validation schema - only validates data types and ranges, no required fields
const variableRulesSchema = Yup.object().shape({
  variableRules: Yup.array().of(
    Yup.object().shape({
      paymentMethod: Yup.string().nullable(),
      rangeFrom: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' || originalValue === null || originalValue === undefined
            ? null
            : Number(originalValue);
        })
        .nullable()
        .min(0, 'Min deposit must be 0 or greater')
        .typeError('Min deposit must be a valid number'),
      rangeTo: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' || originalValue === null || originalValue === undefined
            ? null
            : Number(originalValue);
        })
        .nullable()
        .min(0, 'Max deposit must be 0 or greater')
        .typeError('Max deposit must be a valid number')
        .when('rangeFrom', {
          is: (val) => val !== null && val !== undefined && val !== '',
          then: (schema) =>
            schema.test(
              'greater-than-min',
              'Max deposit must be greater than or equal to min deposit',
              function (value) {
                const { rangeFrom } = this.parent;
                if (value === null || value === undefined || value === '') return true;
                const minValue = Number(rangeFrom);
                return !isNaN(minValue) && value >= minValue;
              }
            )
        }),
      boostPercent: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' || originalValue === null || originalValue === undefined
            ? null
            : Number(originalValue);
        })
        .nullable()
        .min(0, 'Boost percentage must be 0 or greater')
        .max(100, 'Boost percentage cannot exceed 100')
        .typeError('Boost percentage must be a valid number'),
      wagering: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' || originalValue === null || originalValue === undefined
            ? null
            : Number(originalValue);
        })
        .nullable()
        .min(0, 'Wagering must be 0 or greater')
        .typeError('Wagering must be a valid number'),
      mco: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' || originalValue === null || originalValue === undefined
            ? null
            : Number(originalValue);
        })
        .nullable()
        .min(0, 'Max cashout must be 0 or greater')
        .typeError('Max cashout must be a valid number')
    })
  )
});

export function VariableRulesEditor({ rules, onChange, paymentMethodOptions }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(variableRulesSchema),
    mode: 'onChange',
    defaultValues: {
      variableRules: rules.length > 0 ? rules : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variableRules'
  });

  // 🔑 Store JSON snapshot instead of object reference
  const previousRulesJsonRef = useRef(JSON.stringify(rules || []));
  const isInternalUpdateRef = useRef(false);

  const watchedRules = useWatch({
    control,
    name: 'variableRules'
  });

  // Sync external `rules` -> form (reset) when parent changes
  useEffect(() => {
    if (isInternalUpdateRef.current) {
      // This change originated from inside (we already called onChange)
      // so don't immediately reset again
      isInternalUpdateRef.current = false;
      return;
    }

    const incomingJson = JSON.stringify(rules || []);
    const hasChanged = incomingJson !== previousRulesJsonRef.current;

    if (hasChanged) {
      previousRulesJsonRef.current = incomingJson;
      reset({
        variableRules: rules && rules.length > 0 ? rules : []
      });
    }
  }, [rules, reset]);

  // Sync form -> parent `onChange` on every real change
  useEffect(() => {
    if (!watchedRules) return;

    const currentJson = JSON.stringify(watchedRules || []);
    const hasChanged = currentJson !== previousRulesJsonRef.current;

    if (hasChanged) {
      // Mark that the next incoming `rules` change is from us
      isInternalUpdateRef.current = true;
      previousRulesJsonRef.current = currentJson;
      onChange(watchedRules);
    }
  }, [watchedRules, onChange]);
  const handleAddRule = () => {
    append({
      ...defaultRule,
      id: Date.now().toString()
    });
  };

  const handleDeleteRule = (index) => {
    remove(index);
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-dark-50">
          {t('variable_rules')}
        </h4>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-500">
        <form onSubmit={handleSubmit(() => {})}>
          <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-dark-500">
            <thead className="bg-gray-50 dark:bg-dark-700/40">
              <tr className="text-left font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                <th className="px-3 py-2">{t('payment_method')}</th>
                <th className="px-3 py-2">{t('min_deposit')}</th>
                <th className="px-3 py-2">{t('max_deposit')}</th>
                <th className="px-3 py-2">{t('boost_percentage')}</th>
                <th className="px-3 py-2">{t('wagering')}</th>
                <th className="px-3 py-2">{t('max_cashout')}</th>
                <th className="px-3 py-2 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-500">
              {fields.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-gray-500 dark:text-dark-200">
                    {t('no_variable_rules_added_yet')}
                  </td>
                </tr>
              ) : (
                fields.map((field, index) => (
                  <tr
                    key={field.id}
                    className="bg-white text-gray-700 dark:bg-dark-700 dark:text-dark-100">
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.paymentMethod`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            label={t('payment_method')}
                            data={paymentMethodOptions}
                            value={value || 'all'}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={{
                              ...inputClassNames,
                              select: 'h-9 text-xs'
                            }}
                            error={errors?.variableRules?.[index]?.paymentMethod?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.rangeFrom`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label={t('min_deposit')}
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={inputClassNames}
                            error={errors?.variableRules?.[index]?.rangeFrom?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.rangeTo`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label={t('max_deposit')}
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={inputClassNames}
                            error={errors?.variableRules?.[index]?.rangeTo?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.boostPercent`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label={t('boost_percentage')}
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={inputClassNames}
                            error={errors?.variableRules?.[index]?.boostPercent?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.wagering`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label={t('wagering')}
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={inputClassNames}
                            error={errors?.variableRules?.[index]?.wagering?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Controller
                        name={`variableRules.${index}.mco`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label={t('max_cashout')}
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            classNames={inputClassNames}
                            error={errors?.variableRules?.[index]?.mco?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="flat"
                          color="error"
                          className="h-8 px-3 text-xs"
                          onClick={() => handleDeleteRule(index)}>
                          {t('delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </form>
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
      minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      boostPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      wagering: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxCashout: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  paymentMethodOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};
