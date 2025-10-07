import { useTranslation } from 'react-i18next';
import { Controller, useFieldArray } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PercentBadgeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import {
  commissionTypes,
  cpaTriggerOptions,
  commissionFieldConfig,
  getDefaultCommission
} from './commissionConfig';

const CommissionForm = ({ control, register, errors, watch }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'commissions'
  });

  const watchedCommissions = watch('commissions');

  const addCommission = () => {
    // Find the first commission type that hasn't been used yet
    const usedTypes = watchedCommissions?.map((c) => c.commissionType) || [];
    const availableType = commissionTypes.find((type) => !usedTypes.includes(type.value));

    if (availableType) {
      append(getDefaultCommission(availableType.value));
    }
  };

  // Get available commission types (excluding already selected ones)
  const getAvailableCommissionTypes = (currentIndex) => {
    const usedTypes =
      watchedCommissions
        ?.map((c, index) => (index !== currentIndex ? c.commissionType : null))
        .filter(Boolean) || [];

    return commissionTypes.filter((type) => !usedTypes.includes(type.value));
  };

  const removeCommission = (index) => {
    remove(index);
  };

  const renderCommissionFields = (commission, index) => {
    const commissionType = commission?.commissionType || 'turnover';
    const config = commissionFieldConfig[commissionType];
    const cpaTrigger = commission?.cpaTrigger || 'deposit';

    return (
      <div key={`commission-${index}`} className="space-y-4">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/30 p-4 dark:border-dark-500 dark:bg-dark-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                {commissionTypes.find((type) => type.value === commissionType)?.label ||
                  'Commission'}
              </span>
            </div>
            <Button
              type="button"
              variant="flat"
              color="error"
              size="sm"
              onClick={() => removeCommission(index)}
              isIcon
              className="size-7">
              <TrashIcon className="size-3.5" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Commission Type */}
            <Controller
              name={`commissions.${index}.commissionType`}
              control={control}
              render={({ field }) => (
                <Listbox
                  data={getAvailableCommissionTypes(index)}
                  value={
                    getAvailableCommissionTypes(index).find((type) => type.value === field.value) ||
                    null
                  }
                  onChange={(val) => {
                    field.onChange(val.value);
                    // Reset other fields when type changes
                    const newCommission = getDefaultCommission(val.value);
                    Object.keys(newCommission).forEach((key) => {
                      if (key !== 'commissionType') {
                        control._formValues.commissions[index][key] = newCommission[key];
                      }
                    });
                  }}
                  name={field.name}
                  label={t('commission') + ' ' + t('type')}
                  placeholder={t('commission') + ' ' + t('type')}
                  displayField="label"
                  error={errors?.commissions?.[index]?.commissionType?.message}
                  size="sm"
                />
              )}
            />

            {/* Turnover Percent */}
            {config.fields.includes('turnoverPercent') && (
              <Input
                {...register(`commissions.${index}.turnoverPercent`)}
                type="number"
                step="0.01"
                min="0"
                max="100"
                prefix={<PercentBadgeIcon className="size-4" />}
                label={t('turnover') + ' ' + t('percent') + ' (%)'}
                placeholder="0.00"
                error={errors?.commissions?.[index]?.turnoverPercent?.message}
                size="sm"
              />
            )}

            {/* Turnover Target Amount */}
            {config.fields.includes('turnoverTargetAmount') && (
              <Input
                {...register(`commissions.${index}.turnoverTargetAmount`)}
                type="number"
                step="0.01"
                min="1"
                prefix={<CurrencyDollarIcon className="size-4" />}
                label={t('target') + ' ' + t('amount')}
                placeholder="1000.00"
                error={errors?.commissions?.[index]?.turnoverTargetAmount?.message}
                size="sm"
              />
            )}
          </div>

          {/* CPA Specific Fields */}
          {commissionType === 'cpa' && (
            <div className="space-y-4">
              {/* Primary CPA Fields */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  {...register(`commissions.${index}.cpaPayoutAmount`)}
                  type="number"
                  step="0.01"
                  min="0"
                  prefix={<CurrencyDollarIcon className="size-4" />}
                  label="CPA Amount"
                  placeholder="0.00"
                  error={errors?.commissions?.[index]?.cpaPayoutAmount?.message}
                  size="sm"
                />

                <Controller
                  name={`commissions.${index}.cpaTrigger`}
                  control={control}
                  render={({ field }) => (
                    <Listbox
                      data={cpaTriggerOptions}
                      value={
                        cpaTriggerOptions.find((trigger) => trigger.value === field.value) || null
                      }
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label="Trigger Type"
                      placeholder="Select Trigger Type"
                      displayField="label"
                      error={errors?.commissions?.[index]?.cpaTrigger?.message}
                      size="sm"
                    />
                  )}
                />
              </div>

              {/* Conditional Minimum Requirements */}
              {(cpaTrigger === 'deposit' || cpaTrigger === 'bet' || cpaTrigger === 'both') && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(cpaTrigger === 'deposit' || cpaTrigger === 'both') && (
                      <Input
                        {...register(`commissions.${index}.cpaDepositMinAmount`)}
                        type="number"
                        step="0.01"
                        min="0"
                        prefix={<CurrencyDollarIcon className="size-4" />}
                        label="Min Deposit Amount"
                        placeholder="0.00"
                        error={errors?.commissions?.[index]?.cpaDepositMinAmount?.message}
                        size="sm"
                      />
                    )}

                    {(cpaTrigger === 'bet' || cpaTrigger === 'both') && (
                      <Input
                        {...register(`commissions.${index}.cpaBetMinAmount`)}
                        type="number"
                        step="0.01"
                        min="0"
                        prefix={<CurrencyDollarIcon className="size-4" />}
                        label="Min Bet Amount"
                        placeholder="0.00"
                        error={errors?.commissions?.[index]?.cpaBetMinAmount?.message}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Check if all commission types are used
  const usedTypes = watchedCommissions?.map((c) => c.commissionType) || [];
  const canAddMore = usedTypes.length < commissionTypes.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-base font-medium text-gray-800 dark:text-dark-100">
          {t('commission_settings') || 'Commission Settings'}
        </h5>
        {canAddMore && (
          <Button
            type="button"
            variant="flat"
            color="primary"
            size="sm"
            onClick={addCommission}
            className="flex items-center gap-1.5 text-xs">
            <PlusIcon className="size-3.5" />
            {t('add_commission')}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-dark-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('no_commissions_added')}</p>
            <Button
              type="button"
              variant="flat"
              color="primary"
              size="sm"
              onClick={addCommission}
              className="mt-2">
              {t('add_commission')}
            </Button>
          </div>
        ) : (
          fields.map((field, index) =>
            renderCommissionFields(watchedCommissions?.[index] || field, index)
          )
        )}
      </div>
    </div>
  );
};

CommissionForm.propTypes = {
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func.isRequired
};

export default CommissionForm;
