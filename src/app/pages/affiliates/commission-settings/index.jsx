// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input, Switch } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import AffiliatesService from 'services/affiliates.services';
import { commissionSettingsSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const CommissionSettings = () => {
  const { affiliateId } = useParams();
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const pageTitle = t('commission') + ' ' + t('setting');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(commissionSettingsSchema),
    defaultValues: {
      CPAAmount: 0,
      MinDepositForCPA: 0,
      MinWagerForCPA: 0,
      LossCommissionPercent: 0,
      IsCPAAmountRequired: false,
      IsLossCommissionPercentageRequired: false
    }
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCommissionSettings();
      if (result) {
        const data = Array.isArray(result) ? result[0] : result;
        const isCPAReq =
          typeof data?.IsCPAAmountRequired === 'number'
            ? data.IsCPAAmountRequired === 1
            : !!data?.IsCPAAmountRequired;
        const isLossReq =
          typeof data?.IsLossCommissionPercentageRequired === 'number'
            ? data.IsLossCommissionPercentageRequired === 1
            : !!data?.IsLossCommissionPercentageRequired;

        reset({
          CPAAmount: data?.CPAAmount ?? 0,
          MinDepositForCPA: data?.MinDepositForCPA ?? 0,
          MinWagerForCPA: data?.MinWagerForCPA ?? 0,
          LossCommissionPercent: data?.LossCommissionPercent ?? 0,
          IsCPAAmountRequired: isCPAReq,
          IsLossCommissionPercentageRequired: isLossReq
        });

        // If switches are off on load, ensure related fields are zeroed
        if (!isCPAReq) {
          setValue('CPAAmount', 0);
          setValue('MinDepositForCPA', 0);
          setValue('MinWagerForCPA', 0);
        }
        if (!isLossReq) {
          setValue('LossCommissionPercent', 0);
        }
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateId]);

  const fetchCommissionSettings = async () => {
    setError('');
    const res = await AffiliatesService.getCommissionSettings({ affiliateId });
    if (res) {
      if (res.status === 200 || res.status === 201) {
        // API shape could be { data: {...} } or direct object
        const payload = res.response?.data ?? res.response ?? res;
        return payload?.data ?? payload;
      }
      setError(res.error);
    }
  };

  const updateCommissionSettings = async (requestObject) => {
    setLoading(true);
    setError('');
    const res = await AffiliatesService.updateCommissionSettings(requestObject);
    if (res) {
      if (res.status === 200 || res.status === 201) {
        setResponse(res.response);
        setLoading(false);
        return true;
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
    return false;
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    if (!loading && !error && response) {
      const message = response?.message || t('updated_successfully');
      toast.success(message);
      setResponse(null);
      // Optionally refresh from server; keep if backend may adjust values
      // fetchCommissionSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const onSubmit = async (data) => {
    const payload = {
      affiliateUID: affiliateId,
      CPAAmount: String(data.CPAAmount ?? ''),
      MinDepositForCPA: String(data.MinDepositForCPA ?? ''),
      MinWagerForCPA: String(data.MinWagerForCPA ?? ''),
      LossCommissionPercent: String(data.LossCommissionPercent ?? ''),
      IsCPAAmountRequired: data.IsCPAAmountRequired ? 1 : 0,
      IsLossCommissionPercentageRequired: data.IsLossCommissionPercentageRequired ? 1 : 0
    };
    const ok = await updateCommissionSettings(payload);
    if (ok) {
      // Persist the just-submitted values as the new defaults so Reset returns to them
      const newDefaults = {
        CPAAmount: data.IsCPAAmountRequired ? Number(data.CPAAmount || 0) : 0,
        MinDepositForCPA: data.IsCPAAmountRequired ? Number(data.MinDepositForCPA || 0) : 0,
        MinWagerForCPA: data.IsCPAAmountRequired ? Number(data.MinWagerForCPA || 0) : 0,
        LossCommissionPercent: data.IsLossCommissionPercentageRequired
          ? Number(data.LossCommissionPercent || 0)
          : 0,
        IsCPAAmountRequired: !!data.IsCPAAmountRequired,
        IsLossCommissionPercentageRequired: !!data.IsLossCommissionPercentageRequired
      };
      reset(newDefaults);
    }
  };

  const isCPARequired = watch('IsCPAAmountRequired');
  const isLossPctRequired = watch('IsLossCommissionPercentageRequired');

  // When CPA switch is disabled, zero all CPA-related fields
  useEffect(() => {
    if (!isCPARequired) {
      setValue('CPAAmount', 0);
      setValue('MinDepositForCPA', 0);
      setValue('MinWagerForCPA', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCPARequired]);

  // When Loss % switch is disabled, zero the field
  useEffect(() => {
    if (!isLossPctRequired) {
      setValue('LossCommissionPercent', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLossPctRequired]);

  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('commission') + ' ' + t('setting') }
  ];

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="transition-content grid w-full grid-rows-[auto_1fr] pt-4">
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {pageTitle}
            </h2>
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <div className="mt-6 space-y-4">
            {/* Switches row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Switch
                  {...register('IsCPAAmountRequired')}
                  label={t('is_cpa_required', { defaultValue: 'CPA Required' })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  {...register('IsLossCommissionPercentageRequired')}
                  label={t('is_loss_commission_percentage_required', {
                    defaultValue: 'Loss Commission % Required'
                  })}
                />
              </div>
            </div>

            {/* CPA inputs - visible only when required */}
            {isCPARequired && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  {...register('CPAAmount')}
                  label={t('cpa_amount', { defaultValue: 'CPA Amount' })}
                  type="number"
                  step="any"
                  minLength={1}
                  maxLength={10}
                  error={errors?.CPAAmount?.message}
                  placeholder={t('cpa_amount_placeholder', { defaultValue: 'Enter CPA Amount' })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', ' '].includes(e.key)) e.preventDefault();
                  }}
                />
                <Input
                  {...register('MinDepositForCPA')}
                  label={t('min_deposit_for_cpa', { defaultValue: 'Min Deposit For CPA' })}
                  type="number"
                  step="any"
                  minLength={1}
                  maxLength={10}
                  error={errors?.MinDepositForCPA?.message}
                  placeholder={t('min_deposit_for_cpa_placeholder', {
                    defaultValue: 'Enter Min Deposit For CPA'
                  })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', ' '].includes(e.key)) e.preventDefault();
                  }}
                />
                <Input
                  {...register('MinWagerForCPA')}
                  label={t('min_wager_for_cpa', { defaultValue: 'Min Wager For CPA' })}
                  type="number"
                  step="any"
                  minLength={1}
                  maxLength={10}
                  error={errors?.MinWagerForCPA?.message}
                  placeholder={t('min_wager_for_cpa_placeholder', {
                    defaultValue: 'Enter Min Wager For CPA'
                  })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', ' '].includes(e.key)) e.preventDefault();
                  }}
                />
              </div>
            )}

            {/* Loss % input - visible only when required */}
            {isLossPctRequired && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  {...register('LossCommissionPercent')}
                  label={t('loss_commission_percent', { defaultValue: 'Loss Commission %' })}
                  type="number"
                  step="any"
                  minLength={1}
                  maxLength={5}
                  error={errors?.LossCommissionPercent?.message}
                  placeholder={t('loss_commission_percent_placeholder', {
                    defaultValue: 'Enter Loss Commission %'
                  })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', ' '].includes(e.key)) e.preventDefault();
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CommissionSettings;
