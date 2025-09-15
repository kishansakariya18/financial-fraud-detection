// Import Dependencies
import { Page } from 'components/shared/Page';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Skeleton, Card } from 'components/ui';
import PaymentProviderService from 'services/payment-provider-config.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { statusToAPP } from './helper';
import { useTranslation } from 'react-i18next';
import {
  getDateInUTCToTimeZone,
  capitalizeFirstLetter,
  providerConfigTypeMapper,
  getBoolOptions
} from 'helpers/functions';
import { Listbox } from 'components/shared/form/Listbox';

const EditProvider = () => {
  const { t } = useTranslation();
  const { providerUID } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);

  const pageTitle = t('edit') + ' ' + t('paymentProvider');
  const breadcrumbItem = [
    { title: t('paymentProvider'), path: '/site-configuration/payment-provider-config' },
    { title: t('edit') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm();
  console.log('errors:', errors);

  const fetchPaymentProviderDetails = async () => {
    setLoading(true);
    const result = await PaymentProviderService.getProviderDetails(providerUID);
    if (result.status === 200) {
      const details = result.response.data;
      setProviderDetails(details);
      const paymentGatewayConfig = details.PaymentGatewayConfig[0]?.Config;
      const defaultData = {};
      if (paymentGatewayConfig) {
        for (const key in paymentGatewayConfig) {
          defaultData[paymentGatewayConfig[key].key] = paymentGatewayConfig[key].value;
        }
        console.log('defaultData::', defaultData);
        console.log('PaymentGatewayConfig::', paymentGatewayConfig);
        reset(defaultData);
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const editPaymentProviderApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PaymentProviderService.updateProvider(providerUID, requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (providerUID) {
      fetchPaymentProviderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerUID]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/site-configuration/payment-provider-config');
    }, 0);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    console.log('data:', data);
    const existingConfig = JSON.parse(
      JSON.stringify(providerDetails?.PaymentGatewayConfig[0]?.Config)
    );
    for (const configKey in data) {
      if (existingConfig[configKey]) {
        existingConfig[configKey].value = data[configKey];
      }
    }
    console.log('existingConfig:', existingConfig);
    await editPaymentProviderApi({
      providerUID: providerUID,
      configData: existingConfig
    });
  };
  const boolOptions = getBoolOptions();
  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          {providerDetails && (
            <Card className="mb-6 h-20 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('provider') + ' ' + t('name')}
                  </p>
                  <p>{providerDetails.Name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('provider') + ' ' + t('uid')}
                  </p>
                  <p>{providerDetails.GatewayUID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('status')}
                  </p>
                  <p>{capitalizeFirstLetter(statusToAPP(providerDetails.IsActive))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('createdAt')}
                  </p>
                  <p>
                    {getDateInUTCToTimeZone(providerDetails.PaymentGatewayConfig[0]?.DateCreated) ||
                      '-'}
                  </p>
                </div>
              </div>
            </Card>
          )}
          <Card className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              {loading &&
                [...Array(10)].map((_, i) => (
                  <Skeleton className="grid gap-4 sm:grid-cols-2" key={i} />
                ))}
              {!loading && (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.values(providerDetails?.PaymentGatewayConfig[0]?.Config || {}).map(
                      (item) => {
                        const tagType = providerConfigTypeMapper(item.type);
                        if (tagType === 'select') {
                          return (
                            <Controller
                              render={({ field }) => (
                                <Listbox
                                  data={boolOptions}
                                  value={
                                    boolOptions.find((opt) => opt.value === field.value) || null
                                  }
                                  onChange={(val) => field.onChange(val.value)}
                                  name={field.name}
                                  label={item.label}
                                  placeholder={t('select') + ' ' + item.label + ' ' + t('option')}
                                  displayField="label"
                                  error={errors[item.key]?.message}
                                />
                              )}
                              key={item.id}
                              control={control}
                              name={item.key}
                            />
                          );
                        } else {
                          return (
                            <Input
                              key={item.id}
                              type={tagType}
                              {...register(item.key)}
                              label={item.label}
                              error={errors[item.key]?.message}
                              placeholder={t('enter') + ' ' + item.label}
                            />
                          );
                        }
                      }
                    )}
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  type="submit"
                  className="min-w-[7rem]"
                  color="primary"
                  disabled={isSubmitting || loading}>
                  {t('update')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default EditProvider;
