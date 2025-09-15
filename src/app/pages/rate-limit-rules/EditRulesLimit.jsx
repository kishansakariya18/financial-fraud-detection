import { Page } from 'components/shared/Page';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/ui';
import { Input } from 'components/ui';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import RateLimitRuleService from 'services/rate-limit-rules.services';
import * as yup from 'yup';

// Validation schema
const rateLimitRuleSchema = yup.object().shape({
  label: yup.string().required('Action is required'),
  blockMinutes: yup
    .number()
    .required('Block minutes is required')
    .min(1, 'Block minutes must be at least 1')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  windowMinutes: yup
    .number()
    .required('Window minutes is required')
    .min(1, 'Window minutes must be at least 1')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  maxAttempts: yup
    .number()
    .required('Max attempts is required')
    .min(1, 'Max attempts must be at least 1')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  description: yup.string().required('Description is required')
});

const EditRulesLimit = () => {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const { rateLimitUID } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: t('rate_limit_rules'), path: '/site-configuration/rate-limit-rules' },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(rateLimitRuleSchema)
  });

  // Fetch existing rate limit rule details
  useEffect(() => {
    const fetchRateLimitRule = async () => {
      if (!rateLimitUID) return;
      try {
        setLoading(true);
        const response = await RateLimitRuleService.getRateLimitRuleById(rateLimitUID);
        console.log('API Response:', response);

        // Check different possible response structures
        if (response?.status === 200 || response?.response?.status === 200) {
          // Try different possible data locations in response
          const ruleData =
            response?.data || response?.response?.data || response?.response || response;
          console.log('Rule Data:', ruleData);

          if (ruleData && typeof ruleData === 'object') {
            // Handle different possible field name formats from API
            const formData = {
              label: ruleData.label || ruleData.Label || ruleData.action || ruleData.Action || '',
              blockMinutes:
                ruleData.blockMinutes ||
                ruleData.BlockMinutes ||
                ruleData.block_minutes ||
                parseInt(ruleData.blockMinutes) ||
                parseInt(ruleData.BlockMinutes) ||
                parseInt(ruleData.block_minutes) ||
                0,
              windowMinutes:
                ruleData.windowMinutes ||
                ruleData.WindowMinutes ||
                ruleData.window_minutes ||
                parseInt(ruleData.windowMinutes) ||
                parseInt(ruleData.WindowMinutes) ||
                parseInt(ruleData.window_minutes) ||
                0,
              maxAttempts:
                ruleData.maxAttempts ||
                ruleData.MaxAttempts ||
                ruleData.max_attempts ||
                parseInt(ruleData.maxAttempts) ||
                parseInt(ruleData.MaxAttempts) ||
                parseInt(ruleData.max_attempts) ||
                0,
              description: ruleData.description || ruleData.Description || ''
            };
            console.log('Form Data to be set:', formData);
            setOriginalData(formData);
            reset(formData);
          } else {
            console.error('Invalid rule data structure:', ruleData);
            toast.error(t('invalid_response_format'));
          }
        } else {
          console.error('API request failed:', response);
          toast.error(response?.error || response?.response?.message || t('something_went_wrong'));
        }
      } catch (err) {
        toast.error(err.message || t('something_went_wrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchRateLimitRule();
  }, [rateLimitUID, reset]);

  const updateRateLimitRule = async (data) => {
    setLoading(true);

    console.log(data);
    try {
      const result = await RateLimitRuleService.updateRateLimitRule(rateLimitUID, data);
      if (result?.response?.status === 200 || result?.response?.status === 201) {
        toast.success(result.response.message);
        navigate('/site-configuration/rate-limit-rules');
      } else {
        toast.error(result.response.message);
      }
    } catch (err) {
      toast.error(err.message || t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      reset(originalData);
    }
  };

  return (
    <Page title={t('edit') + ' ' + t('rate_limit_rule')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('rate_limit_rule')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <form onSubmit={handleSubmit(updateRateLimitRule)} className="space-y-6">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('label')}
                label={t('action')}
                error={errors?.label?.message}
                placeholder={t('enter') + ' ' + t('action')}
                disabled
              />
              <Input
                {...register('blockMinutes', { valueAsNumber: true })}
                label={t('block_minutes')}
                type="number"
                step="any"
                error={errors?.blockMinutes?.message}
                placeholder={t('enter') + ' ' + t('block_minutes')}
                disabled={loading}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('windowMinutes', { valueAsNumber: true })}
                label={t('window_minutes')}
                type="number"
                step="any"
                error={errors?.windowMinutes?.message}
                placeholder={t('enter') + ' ' + t('window_minutes')}
                disabled={loading}
              />
              <Input
                {...register('maxAttempts', { valueAsNumber: true })}
                label={t('max_attempts')}
                type="number"
                step="any"
                error={errors?.maxAttempts?.message}
                placeholder={t('enter') + ' ' + t('max_attempts')}
                disabled={loading}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                {...register('description')}
                label={t('description')}
                error={errors?.description?.message}
                placeholder={t('enter') + ' ' + t('description')}
                disabled
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={handleReset}
              disabled={loading}
              variant="outlined">
              {t('reset')}
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
        </form>
      </div>
    </Page>
  );
};

export default EditRulesLimit;
