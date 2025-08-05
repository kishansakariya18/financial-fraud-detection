// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createUserClassLimitSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import SegmentationService from 'services/segmentation.services';
import { USER_CLASS_LIMIT_TYPE, USER_CLASS_LIMIT_PERIOD } from 'constants/app.constant';
import { segmentationLimitDetailResponseMapper } from './helper';

const EditSegmentationLimit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { segmentationId, segmentationLimitUID } = useParams();

  const breadcrumbItems = [
    { title: t('segmentation'), path: '/segmentation' },
    { title: t('limits'), path: `/segmentation/${segmentationId}/limits` },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(createUserClassLimitSchema)
  });

  const limitTypeOptions = [
    { value: 'deposit', label: USER_CLASS_LIMIT_TYPE.DEPOSIT },
    { value: 'withdraw', label: USER_CLASS_LIMIT_TYPE.WITHDRAW },
    { value: 'wager', label: USER_CLASS_LIMIT_TYPE.WAGER },
    { value: 'loss', label: USER_CLASS_LIMIT_TYPE.LOSS }
  ];

  const limitPeriodOptions = [
    { value: 'daily', label: USER_CLASS_LIMIT_PERIOD.DAILY },
    { value: 'weekly', label: USER_CLASS_LIMIT_PERIOD.WEEKLY },
    { value: 'monthly', label: USER_CLASS_LIMIT_PERIOD.MONTHLY }
  ];
  useEffect(() => {
    const fetchSegmentationLimit = async () => {
      console.log('Fetching segmentation limit for segmentation ID:', segmentationLimitUID);
      if (!segmentationLimitUID) return;

      try {
        setError('');
        setLoading(true);
        const result = await SegmentationService.segmentationLimitDetail(segmentationLimitUID);
        console.log('API Response:', result);

        const mappedData = segmentationLimitDetailResponseMapper(result.response);
        console.log('Mapped data:', mappedData);

        if (mappedData) {
          reset({
            limitType: mappedData.limitType,
            limitPeriod: mappedData.limitPeriod,
            limitAmount: mappedData.limitAmount,
            currencyCode: mappedData.currencyCode,
            status: mappedData.isActive
          });
        } else {
          setError(t('invalid_response_format'));
        }
      } catch (err) {
        console.error('Error fetching segmentation limit:', err);
        setError(err.message || t('something_went_wrong'));
        toast.error(err.message || t('something_went_wrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentationLimit();
  }, [segmentationLimitUID, reset, t]);

  const updateSegmentationLimit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const requestData = {
        limitType: data.limitType,
        limitPeriod: data.limitPeriod,
        limitAmount: data.limitAmount,
        segmentationLimitUID: segmentationLimitUID
      };

      const result = await SegmentationService.updateSegmentationLimit(requestData);
      if (result.status === 200 || result.status === 201) {
        toast.success(result.response.message);
        navigate(`/segmentation/${segmentationId}/limits`);
      } else {
        setError(result.response.message || t('something_went_wrong'));
      }
    } catch (err) {
      console.error('Error updating segmentation limit:', err);
      setError(err.response.message || t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    toast.error(error);
  }
  return (
    <Page title={t('edit') + ' ' + t('segmentation') + ' ' + t('limit')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('segmentation') + ' ' + t('limit')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <form onSubmit={handleSubmit(updateSegmentationLimit)} className="space-y-6">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="limitType"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={limitTypeOptions}
                    value={limitTypeOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('limit_type')}
                    placeholder={t('select') + ' ' + t('limit_type')}
                    displayField="label"
                    error={errors.limitType?.message}
                  />
                )}
              />
              <Controller
                name="limitPeriod"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={limitPeriodOptions}
                    value={limitPeriodOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('limit_period')}
                    placeholder={t('select') + ' ' + t('limit_period')}
                    displayField="label"
                    error={errors.limitPeriod?.message}
                  />
                )}
              />

              <Input
                label={t('limit_amount')}
                type="number"
                step="any"
                {...register('limitAmount')}
                error={errors.limitAmount?.message}
                placeholder={t('enter') + ' ' + t('limitAmount')}
              />
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                className="min-w-[7rem]"
                onClick={() => navigate(`/segmentation/${segmentationId}/limits`)}
                disabled={loading}
                variant="outlined">
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="min-w-[7rem]"
                color="primary"
                loading={loading}
                disabled={loading}>
                {t('update')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditSegmentationLimit;
