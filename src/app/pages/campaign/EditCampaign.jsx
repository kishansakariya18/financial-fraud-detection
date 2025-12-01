// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Select, Textarea } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import CampaignService from 'services/campaign.service';
import { createCampaignSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { campaignStatusOptions } from './helper';
import { DatePicker } from 'components/shared/form/Datepicker';

const EditCampaign = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const { t } = useTranslation();
  const { campaignUID } = useParams();

  const breadcrumbItem = [{ title: t('campaign'), path: '/campaign' }, { title: t('edit') }];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(createCampaignSchema),
    defaultValues: {
      campaignName: '',
      status: 'inactive',
      startDate: '',
      endDate: '',
      description: '',
      tags: [],
      targetSegment: '',
      forceIncludePlayers: '',
      forceExcludePlayers: ''
    }
  });

  const description = watch('description') || '';
  const formValues = watch();

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      setFetchLoading(true);
      const result = await CampaignService.campaignDetail(campaignUID);
      if (result?.status === 200) {
        const data = result.response?.data;
        if (data) {
          reset({
            campaignName: data.CampaignName || '',
            status: data.Status === 1 ? 'active' : data.Status === 2 ? 'archive' : 'inactive',
            startDate: data.StartDate ? new Date(data.StartDate).toISOString().slice(0, 16) : '',
            endDate: data.EndDate ? new Date(data.EndDate).toISOString().slice(0, 16) : '',
            description: data.Description || '',
            targetSegment: data.TargetSegment || '',
            forceIncludePlayers: data.ForceIncludePlayers || '',
            forceExcludePlayers: data.ForceExcludePlayers || ''
          });
          setTags(data.Tags || []);
        }
      } else {
        toast.error(result?.error || 'Failed to fetch campaign details');
        navigate('/campaign');
      }
      setFetchLoading(false);
    };

    if (campaignUID) {
      fetchCampaignDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignUID]);

  const updateCampaignAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await CampaignService.updateCampaign({
      ...requestObject,
      campaignUID
    });
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    if (!loading && !error && response) {
      toast.success(response.message || 'Campaign updated successfully');
      setResponse(null);
      navigate('/campaign');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      tags: tags
    };
    await updateCampaignAPI(submitData);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (fetchLoading) {
    return (
      <Page title={t('edit') + ' ' + t('campaign')}>
        <div className="flex h-96 items-center justify-center">
          <div className="text-gray-500">{t('loading')}...</div>
        </div>
      </Page>
    );
  }

  return (
    <Page title={t('edit') + ' ' + t('campaign')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('campaign')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <div className="space-y-6">
            {/* Basics Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                1. Basics
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Name, optional timing, and tags. Status stays Inactive until you activate in Review.
              </p>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    {...register('campaignName')}
                    label={t('campaign') + ' ' + t('name') + '*'}
                    error={errors?.campaignName?.message}
                    placeholder="e.g. August Kickoff Reloads"
                  />
                  <Select
                    {...register('status')}
                    label={t('status')}
                    error={errors?.status?.message}
                    data={campaignStatusOptions}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    render={({ field: { onChange, value, ...rest } }) => (
                      <DatePicker
                        onChange={onChange}
                        value={value || ''}
                        label={t('start') + ' ' + t('date')}
                        error={errors?.startDate?.message}
                        options={{
                          disableMobile: true,
                          time_24hr: true,
                          minDate: 'today'
                        }}
                        placeholder="Choose date..."
                        {...rest}
                      />
                    )}
                    name="startDate"
                    control={control}
                  />
                  <Controller
                    render={({ field: { onChange, value, ...rest } }) => (
                      <DatePicker
                        onChange={onChange}
                        value={value || ''}
                        label={t('end') + ' ' + t('date')}
                        error={errors?.endDate?.message}
                        options={{
                          disableMobile: true,
                          time_24hr: true,
                          minDate: 'today'
                        }}
                        placeholder="Choose date..."
                        {...rest}
                      />
                    )}
                    name="endDate"
                    control={control}
                  />
                </div>

                <div>
                  <Textarea
                    {...register('description')}
                    label={
                      <div className="flex items-center justify-between">
                        <span>
                          {t('description')} <span className="text-gray-400">Optional. 0/240</span>
                        </span>
                        <span className="text-xs text-gray-400">{description.length}/240</span>
                      </div>
                    }
                    error={errors?.description?.message}
                    placeholder="Internal notes for admins"
                    rows={3}
                    maxLength={240}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-dark-200">
                    {t('tags')} <span className="text-xs text-gray-400">Press Enter to add</span>
                  </label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Type a tag..."
                      classNames={{ root: 'flex-1' }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="whitespace-nowrap px-4"
                      disabled={!tagInput.trim()}>
                      {t('add')}
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-dark-600 dark:text-dark-200 rtl:space-x-reverse">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="rounded-sm hover:bg-gray-200 dark:hover:bg-dark-500">
                            <XMarkIcon className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Targeting Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                2. Targeting
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Pick a segment and optionally force include / exclude players.
              </p>

              <div className="space-y-4">
                <Input
                  {...register('targetSegment')}
                  label={t('target') + ' ' + t('segment')}
                  error={errors?.targetSegment?.message}
                  placeholder="Search or paste ID"
                />

                <Textarea
                  {...register('forceIncludePlayers')}
                  label={t('force') + ' ' + t('include') + ' ' + t('players')}
                  error={errors?.forceIncludePlayers?.message}
                  placeholder="Internal notes for admins"
                  rows={3}
                />

                <Textarea
                  {...register('forceExcludePlayers')}
                  label={t('force') + ' ' + t('exclude') + ' ' + t('players')}
                  error={errors?.forceExcludePlayers?.message}
                  placeholder="Internal notes for admins"
                  rows={3}
                />
              </div>
            </div>

            {/* Review & Launch Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                3. Review & Launch
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Read-only summary and payload preview.
              </p>

              <div className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Name:</span>
                    <span className="break-all text-gray-600 dark:text-dark-200">
                      {formValues.campaignName || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Start:</span>
                    <span className="text-gray-600 dark:text-dark-200">
                      {formValues.startDate ? new Date(formValues.startDate).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Segment:</span>
                    <span className="break-all text-gray-600 dark:text-dark-200">
                      {formValues.targetSegment || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Exclude:</span>
                    <span className="truncate text-gray-600 dark:text-dark-200">
                      {formValues.forceExcludePlayers || '-'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Status:</span>
                    <span className="capitalize text-gray-600 dark:text-dark-200">
                      {formValues.status || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">End:</span>
                    <span className="text-gray-600 dark:text-dark-200">
                      {formValues.endDate ? new Date(formValues.endDate).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium text-gray-900 dark:text-dark-50">Include:</span>
                    <span className="truncate text-gray-600 dark:text-dark-200">
                      {formValues.forceIncludePlayers || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={() => navigate('/campaign')}
              disabled={loading}>
              {t('cancel')}
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

export default EditCampaign;
