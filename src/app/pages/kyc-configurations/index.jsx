// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { kycLevelConfigSchema } from './schema';
import KycConfigurationsService from 'services/kyc-configurations.services';
import KYCProviderService from 'services/kyc-provider.services';
import { Listbox } from 'components/shared/form/Listbox';
import { Button } from 'components/ui';
import { capitalizeFirstLetter } from 'helpers/functions';
// import { Card } from 'components/ui';

const KycConfigurations = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [providerOptions, setProviderOptions] = useState([]);
  const [levelLoading, setLevelLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [response, setResponse] = useState(null);

  const pageTitle = t('kycConfigurations');

  const { reset, watch, control, handleSubmit } = useForm({
    resolver: yupResolver(kycLevelConfigSchema),
    defaultValues: {
      mappings: []
    }
  });

  // Fetch KYC providers and level configuration
  const fetchProviders = async () => {
    const res = await KYCProviderService.kycProviderList({
      pagination: { pageIndex: 0, pageSize: 100 },
      filters: { keyword: '', status: '' }
    });
    if (res && (res.status === 200 || res.status === 201)) {
      const list = res.response?.data || [];
      const options = [
        { value: 'manual', label: 'Manual' },
        ...list.map((p) => ({ value: p.ProviderID, label: capitalizeFirstLetter(p.ProviderName) }))
      ];
      setProviderOptions(options);
    } else if (res?.error) {
      setError(res.error);
    }
  };

  const fetchLevelConfig = async () => {
    setLevelLoading(true);
    const res = await KycConfigurationsService.getLevelConfig();
    if (res && (res.status === 200 || res.status === 201)) {
      const payload = res.response?.data ?? res.response ?? res;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      const mappings = items.map((it) => {
        const hasMapping =
          Array.isArray(it.documentProviderMappings) && it.documentProviderMappings.length > 0;
        const providerId = hasMapping ? it.documentProviderMappings[0]?.ProviderID : 'manual';
        return {
          slug: it.Slug,
          provider: providerId ?? 'manual',
          title: it.Title,
          isRequired: it.IsRequired
        };
      });
      reset({ mappings });
    } else if (res?.error) {
      setError(res.error);
    }
    setLevelLoading(false);
  };

  useEffect(() => {
    fetchProviders();
    fetchLevelConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!levelLoading && !saving && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    if (!levelLoading && !error && response) {
      const message = response?.message || t('updatedSuccessfully');
      toast.success(message);
      setResponse(null);
      fetchLevelConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const mappings = watch('mappings');

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      const payload = (data?.mappings || [])
        .filter((m) => m?.slug !== 'basic_details')
        .map((m) => ({
          documentType: m.slug,
          providerId: m.provider === 'manual' ? 0 : m.provider
        }));
      const res = await KycConfigurationsService.updateLevelConfig(payload);
      if (res) {
        if (res.status === 200 || res.status === 201) {
          setResponse(res.response);
        } else {
          setError(res.error);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="transition-content grid w-full grid-rows-[auto_1fr] pt-4">
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {pageTitle}
            </h2>
          </div>
        </div>
        {/* KYC Level Config section (constrained width) */}
        <div className="mx-auto w-full">
          {/* <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <h3 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {t('kyc_level_configurations') || 'KYC Level Configurations'}
            </h3>
          </div> */}
          {(levelLoading || (Array.isArray(mappings) && mappings.length > 0)) && (
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <div className="grid gap-4 md:grid-cols-2">
                {(levelLoading ? Array.from({ length: 0 }) : mappings || []).map((row, idx) => (
                  <div key={row?.title || idx} className="gap-2">
                    <div className="pb-2 text-sm font-medium capitalize text-gray-700 dark:text-dark-200">
                      {row?.title}
                    </div>
                    <Controller
                      name={`mappings.${idx}.provider`}
                      render={({ field, fieldState }) => (
                        <Listbox
                          data={providerOptions}
                          value={providerOptions.find((opt) => opt.value === field.value) || null}
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          placeholder={t('select') + ' ' + t('provider')}
                          displayField="label"
                          error={fieldState?.error?.message}
                          disabled={!row?.isRequired}
                        />
                      )}
                      control={control}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  className="min-w-[7rem]"
                  onClick={() => reset()}
                  disabled={saving || levelLoading}>
                  {t('reset')}
                </Button>
                <Button
                  type="submit"
                  className="min-w-[7rem]"
                  color="primary"
                  disabled={saving || levelLoading}>
                  {t('update')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Page>
  );
};

export default KycConfigurations;
