// Import Dependencies
import { Page } from 'components/shared/Page';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Skeleton, Card, Upload } from 'components/ui';
import PaymentProviderService from 'services/payment-provider-config.services';
import { useEffect, useRef, useState } from 'react';
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
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { getImageURL } from 'utils/showImage';

const EditProvider = () => {
  const { t } = useTranslation();
  const { providerUID } = useParams();
  const [error, setError] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const uploadRef = useRef();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

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
    formState: { errors },
    reset
  } = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  console.log('errors:', errors);

  const fetchPaymentProviderDetails = async () => {
    setDetailsLoading(true);
    const result = await PaymentProviderService.getProviderDetails(providerUID);
    if (result.status === 200) {
      const details = result.response.data;
      details.Logo = details.Logo ? getImageURL('payment', details.Logo) : null;
      setProviderDetails(details);
      const paymentGatewayConfig = details.PaymentGatewayConfig?.Config;
      const defaultData = {};

      // Set default KYC level if no prerequisites exist
      if (
        details?.PaymentGatewaysPrereqisites?.length === 0 ||
        !details?.PaymentGatewaysPrereqisites
      ) {
        defaultData.KYCLevel = '0';
      } else {
        const value =
          details.PaymentGatewaysPrereqisites.find((item) => item.ConfigKey === 'KYCLevel') || {};

        defaultData.KYCLevel = value.ConfigValue;
      }

      if (paymentGatewayConfig) {
        // Add all payment gateway config values to defaultData
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
    setDetailsLoading(false);
  };

  const editPaymentProviderApi = async (requestObject) => {
    setSubmitLoading(true);
    setError(null);

    const result = await PaymentProviderService.updateProvider(providerUID, requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    if (providerUID) {
      fetchPaymentProviderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerUID]);

  if (!detailsLoading && !submitLoading && error) {
    toast.error(error);
    setError('');
  }

  if (!detailsLoading && !submitLoading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/site-configuration/payment-provider-config');
    }, 0);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    console.log('data:', data);
    const existingConfig = JSON.parse(
      JSON.stringify(providerDetails?.PaymentGatewayConfig?.Config)
    );
    for (const configKey in data) {
      if (existingConfig[configKey]) {
        existingConfig[configKey].value = data[configKey];
      }
    }
    console.log('existingConfig:', existingConfig);
    await editPaymentProviderApi({
      providerUID: providerUID,
      providerConfig: existingConfig,
      kycLevel: data.KYCLevel || '0',
      file
    });
  };
  const boolOptions = getBoolOptions();
  const KYCLevelOptions = [
    { label: 'No KYC Required', value: '0' },
    { label: 'KYC Level 1', value: '1' },
    { label: 'KYC Level 2', value: '2' },
    { label: 'KYC Level 3', value: '3' },
    { label: 'KYC Level 4', value: '4' }
  ];
  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
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
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                    {getDateInUTCToTimeZone(providerDetails.PaymentGatewayConfig?.DateCreated) ||
                      '-'}
                  </p>
                </div>
                <div>
                  <RenderImage
                    preview={preview}
                    value={providerDetails?.Logo || ''}
                    id={'providerLogo'}
                    label={t('logo')}
                    enableModal={true}
                  />
                </div>
              </div>
            </Card>
          )}
          <Card className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              {detailsLoading &&
                [...Array(10)].map((_, i) => (
                  <Skeleton className="grid gap-4 sm:grid-cols-2" key={i} />
                ))}
              {!detailsLoading && (
                <div className="mt-6 space-y-6">
                  {/* Prerequisites Section */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium">{t('prerequisites')}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Controller
                        render={({ field }) => (
                          <Listbox
                            data={KYCLevelOptions}
                            value={KYCLevelOptions.find((opt) => opt.value === field.value) || null}
                            onChange={(val) => field.onChange(val.value)}
                            name={field.name}
                            label={'KYC level'}
                            placeholder={t('select') + ' ' + 'KYC level' + ' ' + t('option')}
                            displayField="label"
                            error={errors['KYCLevel']?.message}
                            disabled={submitLoading || detailsLoading}
                          />
                        )}
                        control={control}
                        name="KYCLevel"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="mb-4 text-lg font-medium">{t('configuration')}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Object.values(providerDetails?.PaymentGatewayConfig?.Config || {}).map(
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
                                    disabled={submitLoading || detailsLoading}
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
                                disabled={submitLoading || detailsLoading}
                              />
                            );
                          }
                        }
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-medium">{t('logo') || 'Logo'}</h3>
                    <div className="grid gap-4 sm:grid-cols-1">
                      {(providerDetails?.Logo || preview) && (
                        <RenderImage
                          preview={preview}
                          value={providerDetails?.Logo || ''}
                          id={'providerLogo'}
                          enableModal={true}
                        />
                      )}
                      <Upload
                        onChange={(f) => {
                          setFile(f);
                        }}
                        ref={uploadRef}
                        setPreview={setPreview}
                        accept={'image/*'}>
                        {({ ...props }) => (
                          <Button
                            color="primary"
                            {...props}
                            className="h-9 w-fit space-x-2 px-3 text-sm"
                            disabled={submitLoading || detailsLoading}>
                            <CloudArrowUpIcon className="size-5" />
                            <span>Choose File</span>
                          </Button>
                        )}
                      </Upload>
                      <Button
                        disabled={!file || submitLoading || detailsLoading}
                        onClick={() => {
                          if (uploadRef.current) uploadRef.current.value = '';
                          setFile();
                          setPreview();
                        }}
                        className="h-9 w-fit px-3 text-sm">
                        Reset
                      </Button>
                      {file && (
                        <div>
                          File name : <span className="font-medium">{file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  type="submit"
                  className="min-w-[7rem]"
                  color="primary"
                  disabled={submitLoading || detailsLoading}
                  loading={submitLoading}>
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
