// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Select, Textarea, Checkbox, Radio } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import CampaignService from 'services/campaign.service';
import SegmentationService from 'services/segmentation.services';
import BonusTemplateService from 'services/bonus-template.services';
import { createCampaignSchema } from './schema';
import { campaignStatusToAPI } from './helper';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DatePicker } from 'components/shared/form/Datepicker';
import TriggersAndSchedule from 'components/sections/campaign/TriggersAndSchedule';

const EditCampaign = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotionIndex, setSelectedPromotionIndex] = useState(null);
  const [segments, setSegments] = useState([]);
  const [bonusTemplates, setBonusTemplates] = useState([]);
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
      status: 'active',
      startDate: '',
      endDate: '',
      description: '',
      tags: [],
      targetSegment: '',
      forceIncludePlayers: '',
      forceExcludePlayers: '',
      // Bonus Removal Rules
      removeAfterTimeEnabled: false,
      removeAfterTimeValue: '',
      removeAfterTimeUnit: 'days',
      removeOnExitSegment: false,
      fixedCutoffDate: null,
      maxClaimsAcrossPromotions: '',
      // Re-Issuance Policy
      reIssuancePolicy: 'one',
      allowStackN: '',
      // Triggers
      onSegmentEntry: false,
      onSegmentExit: false,
      recurring: false,
      scheduleDays: [],
      scheduleTime: '',
      scheduleInterval: '',
      scheduleAnchor: '',
      // Promotions
      promotions: []
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
            startDate: data.StartDate ? new Date(data.StartDate) : '',
            endDate: data.EndDate ? new Date(data.EndDate) : '',
            description: data.Description || '',
            targetSegment: data.TargetSegmentID || '', // Assuming ID is used for now, or map to UID if needed
            forceIncludePlayers: Array.isArray(data.IncludedPlayers)
              ? data.IncludedPlayers.join(', ')
              : data.IncludedPlayers || '',
            forceExcludePlayers: Array.isArray(data.ExcludedPlayers)
              ? data.ExcludedPlayers.join(', ')
              : data.ExcludedPlayers || '',

            // Triggers
            onSegmentEntry: data.TriggerOnEntry === 1,
            onSegmentExit: data.TriggerOnExit === 1,
            recurring: data.isTriggerOnSchedule === 1,
            scheduleDays:
              data.RecurringScheduleConfig?.type === 'weekly' &&
              Array.isArray(data.RecurringScheduleConfig?.days)
                ? data.RecurringScheduleConfig.days.map((d) => {
                    const dayReverseMap = {
                      mon: 1,
                      tue: 2,
                      wed: 3,
                      thu: 4,
                      fri: 5,
                      sat: 6,
                      sun: 7
                    };
                    return dayReverseMap[d] || d;
                  })
                : [],
            scheduleTime:
              data.RecurringScheduleConfig?.type === 'weekly'
                ? data.RecurringScheduleConfig.time
                : '',
            scheduleInterval:
              data.RecurringScheduleConfig?.type === 'every_x_hours'
                ? data.RecurringScheduleConfig.intervalHour
                : '',
            scheduleAnchor:
              data.RecurringScheduleConfig?.type === 'every_x_hours'
                ? data.RecurringScheduleConfig.anchor
                : '',

            // Bonus Removal Rules
            removeAfterTimeEnabled: data.RemoveBonusAfterXTime === 1,
            removeAfterTimeValue:
              data.RemoveBonusAfterDays > 0
                ? data.RemoveBonusAfterDays
                : data.RemoveBonusAfterHours > 0
                  ? data.RemoveBonusAfterHours
                  : '',
            removeAfterTimeUnit:
              data.RemoveBonusAfterDays > 0
                ? 'days'
                : data.RemoveBonusAfterHours > 0
                  ? 'hours'
                  : 'days',
            removeOnExitSegment: data.RemoveOnExitSegment === 1,
            fixedCutoffDate: data.RemoveOnFixedDate ? new Date(data.RemoveOnFixedDate) : null,
            maxClaimsAcrossPromotions: data.MaxClaimAcrossPromotions || '',

            // Re-Issuance Policy
            reIssuancePolicy:
              data.ReissuePolicyType === 0
                ? 'one'
                : data.ReissuePolicyType === 1
                  ? 'reissue'
                  : 'stack',
            allowStackN: data.ReissueBonusUpto || ''
          });
          setTags(data.tags || []);

          // Map Promotions
          if (data.CampaignPromotions && Array.isArray(data.CampaignPromotions)) {
            setPromotions(
              data.CampaignPromotions.map((p) => ({
                id: p.CampaignPromotionID || Date.now().toString(),
                name: p.PromoName || '',
                bonusTemplate: p.BonusTemplateID || '', // Assuming ID matches value in dropdown
                priority: p.Priority || '',
                cooldown: p.CooldownHour || '',
                maxClaims: {
                  days: p.MaxClaimPerDay || '',
                  week: p.MaxClaimPerWeek || '',
                  month: p.MaxClaimPerMonth || '',
                  lifetime: p.MaxClaimLifetime || ''
                },
                title: p.Title || '',
                description: p.PromoDescription || '',
                imageUrls: p.ImageUrl ? [p.ImageUrl] : [] // Assuming single URL in string
              }))
            );
          }
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

  useEffect(() => {
    const fetchSegments = async () => {
      const result = await SegmentationService.getSegmentationList({
        pagination: null,
        filters: {},
        isPaginationRequired: 0
      });
      if (result?.status === 200) {
        const segmentOptions = (result.response?.data || []).map((segment) => ({
          value: segment.UserSegmentID || segment.SegmentationUID || segment.UID, // Fallback to ID if UID missing
          label: segment.Name || segment.SegmentationName
        }));
        setSegments(segmentOptions);
      }
    };

    const fetchBonusTemplates = async () => {
      const result = await BonusTemplateService.getTemplates({
        pagination: { page: 1, limit: 1000 },
        filters: {},
        isPaginationRequired: 0
      });
      if (result?.status === 200) {
        const templateOptions = (result.response?.data || []).map((template) => ({
          value: template.BonusTemplateID || template.UID,
          label: template.TemplateName || template.Name
        }));
        setBonusTemplates(templateOptions);
      }
    };

    fetchSegments();
    fetchBonusTemplates();
  }, []);

  const onSubmit = async (data) => {
    const parseIds = (str) =>
      str
        ? str
            .split(',')
            .map((s) => parseInt(s.trim()))
            .filter((n) => !isNaN(n))
        : [];

    const submitData = {
      campaignUID,
      campaignName: data.campaignName,
      status: campaignStatusToAPI(data.status),
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      targetSegmentID: data.targetSegment ? parseInt(data.targetSegment) : 0,
      includedPlayers: parseIds(data.forceIncludePlayers),
      excludedPlayers: parseIds(data.forceExcludePlayers),

      // Triggers
      triggerOnEntry: data.onSegmentEntry ? 1 : 0,
      triggerOnExit: data.onSegmentExit ? 1 : 0,
      isTriggerOnSchedule: data.recurring ? 1 : 0,
      ...(data.recurring && {
        recurringScheduleType: data.scheduleInterval ? 'every_x_hours' : 'weekly',
        recurringScheduleConfig: data.scheduleInterval
          ? {
              type: 'every_x_hours',
              intervalHour: parseInt(data.scheduleInterval),
              anchor: parseInt(data.scheduleAnchor || 0)
            }
          : {
              type: 'weekly',
              days: (data.scheduleDays || []).map((d) => {
                const dayMap = {
                  1: 'mon',
                  2: 'tue',
                  3: 'wed',
                  4: 'thu',
                  5: 'fri',
                  6: 'sat',
                  7: 'sun'
                };
                return dayMap[d];
              }),
              time: data.scheduleTime
            }
      }),

      // Bonus Removal
      removeBonusAfterXTime: data.removeAfterTimeEnabled ? 1 : 0,
      removeBonusAfterDays:
        data.removeAfterTimeEnabled && data.removeAfterTimeUnit === 'days'
          ? parseInt(data.removeAfterTimeValue)
          : 0,
      removeBonusAfterHours:
        data.removeAfterTimeEnabled && data.removeAfterTimeUnit === 'hours'
          ? parseInt(data.removeAfterTimeValue)
          : 0,
      removeOnExitSegment: data.removeOnExitSegment ? 1 : 0,
      removeOnFixedDate: data.fixedCutoffDate ? new Date(data.fixedCutoffDate).toISOString() : null,
      maxClaimAcrossPromotions: data.maxClaimsAcrossPromotions
        ? parseInt(data.maxClaimsAcrossPromotions)
        : 0,

      // Re-issuance
      reissuePolicyType:
        data.reIssuancePolicy === 'one' ? 0 : data.reIssuancePolicy === 'reissue' ? 1 : 2,
      reissueBonusUpto: data.allowStackN ? parseInt(data.allowStackN) : 0,

      tags: tags,

      // Promotions
      promo: promotions.map((p) => ({
        campaignPromotionID: p.id && p.id.length > 15 ? 0 : parseInt(p.id || 0),
        promoName: p.name,
        bonusTemplateID: p.bonusTemplate ? parseInt(p.bonusTemplate) : 0,
        priority: p.priority ? parseInt(p.priority) : 0,
        cooldownHour: p.cooldown ? parseInt(p.cooldown) : 0,
        maxClaimPerDay: p.maxClaims?.days ? parseInt(p.maxClaims.days) : 0,
        maxClaimPerWeek: p.maxClaims?.week ? parseInt(p.maxClaims.week) : 0,
        maxClaimPerMonth: p.maxClaims?.month ? parseInt(p.maxClaims.month) : 0,
        maxClaimLifetime: p.maxClaims?.lifetime ? parseInt(p.maxClaims.lifetime) : 0,
        title: p.title,
        promoDescription: p.description,
        imageUrl: Array.isArray(p.imageUrls) ? p.imageUrls.flat() : []
      }))
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

  const makeDefaultPromotion = () => ({
    id: Date.now().toString(),
    name: '',
    bonusTemplate: '',
    priority: '',
    cooldown: '',
    maxClaims: { days: '', week: '', month: '', lifetime: '' },
    title: '',
    description: '',
    imageUrls: []
  });

  const handleAddPromotion = () => {
    const next = [...promotions, makeDefaultPromotion()];
    setPromotions(next);
    setSelectedPromotionIndex(next.length - 1);
  };

  const handleRemovePromotion = (index) => {
    const next = promotions.filter((_, i) => i !== index);
    setPromotions(next);
    if (selectedPromotionIndex === index) {
      setSelectedPromotionIndex(next.length ? 0 : null);
    } else if (selectedPromotionIndex > index) {
      setSelectedPromotionIndex((prev) => (prev != null ? prev - 1 : prev));
    }
  };

  const updateSelectedPromotion = (path, value) => {
    if (selectedPromotionIndex == null) return;
    setPromotions((prev) => {
      const next = [...prev];
      const p = { ...next[selectedPromotionIndex] };
      if (path.startsWith('maxClaims.')) {
        const key = path.split('.')[1];
        p.maxClaims = { ...p.maxClaims, [key]: value };
      } else {
        p[path] = value;
      }
      next[selectedPromotionIndex] = p;
      return next;
    });
  };

  const [imageUrlInput, setImageUrlInput] = useState('');
  const addImageUrl = () => {
    if (!imageUrlInput.trim() || selectedPromotionIndex == null) return;
    setPromotions((prev) => {
      const next = [...prev];
      const p = { ...next[selectedPromotionIndex] };
      p.imageUrls = [...(p.imageUrls || []), imageUrlInput.trim()];
      next[selectedPromotionIndex] = p;
      return next;
    });
    setImageUrlInput('');
  };
  const removeImageUrl = (url) => {
    if (selectedPromotionIndex == null) return;
    setPromotions((prev) => {
      const next = [...prev];
      const p = { ...next[selectedPromotionIndex] };
      p.imageUrls = (p.imageUrls || []).filter((u) => u !== url);
      next[selectedPromotionIndex] = p;
      return next;
    });
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
                <Controller
                  name="targetSegment"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t('target') + ' ' + t('segment')}
                      error={errors?.targetSegment?.message}
                      placeholder="Select segment"
                      data={segments}
                    />
                  )}
                />

                <Controller
                  name="forceIncludePlayers"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <Textarea
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(e.target.value.replace(/[^0-9,]/g, ''))}
                      label={t('force') + ' ' + t('include') + ' ' + t('players')}
                      error={errors?.forceIncludePlayers?.message}
                      placeholder="e.g. 101, 102"
                      rows={3}
                    />
                  )}
                />

                <Controller
                  name="forceExcludePlayers"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <Textarea
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(e.target.value.replace(/[^0-9,]/g, ''))}
                      label={t('force') + ' ' + t('exclude') + ' ' + t('players')}
                      error={errors?.forceExcludePlayers?.message}
                      placeholder="e.g. 201, 202"
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>

            {/* Triggers & Schedule */}
            <TriggersAndSchedule
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              register={register}
            />

            {/* Bonus Removal Rules */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                4. Bonus Removal Rules
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Configure when issued bonuses should be removed.
              </p>

              <div className="space-y-4">
                <div>
                  <Checkbox
                    checked={!!formValues.removeAfterTimeEnabled}
                    onChange={(e) => setValue('removeAfterTimeEnabled', e.target.checked)}
                    label="Remove bonuses after X time from issuance"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <Input
                    {...register('removeAfterTimeValue')}
                    type="number"
                    label="Time"
                    error={errors?.removeAfterTimeValue?.message}
                    placeholder="e.g. 400"
                    disabled={!formValues.removeAfterTimeEnabled}
                  />
                  <Select
                    {...register('removeAfterTimeUnit')}
                    label="Unit"
                    error={errors?.removeAfterTimeUnit?.message}
                    disabled={!formValues.removeAfterTimeEnabled}
                    data={[
                      { key: 'minutes', value: 'minutes', label: 'Minutes' },
                      { key: 'hours', value: 'hours', label: 'Hours' },
                      { key: 'days', value: 'days', label: 'Days' },
                      { key: 'weeks', value: 'weeks', label: 'Weeks' }
                    ]}
                  />
                </div>
                <div>
                  <Checkbox
                    checked={!!formValues.removeOnExitSegment}
                    onChange={(e) => setValue('removeOnExitSegment', e.target.checked)}
                    label="Remove if player exits target segment"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    render={({ field: { onChange, value, ...rest } }) => (
                      <DatePicker
                        onChange={onChange}
                        value={value || ''}
                        label="Fixed Cut-off Date"
                        error={errors?.fixedCutoffDate?.message}
                        options={{ disableMobile: true, time_24hr: true }}
                        placeholder="Choose date..."
                        {...rest}
                      />
                    )}
                    name="fixedCutoffDate"
                    control={control}
                  />
                  <Input
                    {...register('maxClaimsAcrossPromotions')}
                    label="Max Claims Across Promotions"
                    error={errors?.maxClaimsAcrossPromotions?.message}
                    placeholder="e.g. 2"
                    type="number"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                5. Promotions
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Attach one or more promotions to this campaign.
              </p>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-dark-600 dark:bg-dark-800/40">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-dark-100">Promotions</span>
                    <Button type="button" size="sm" onClick={handleAddPromotion}>
                      {t('add')}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {promotions.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                          selectedPromotionIndex === idx
                            ? 'bg-primary/5 dark:bg-primary/10 border-primary-500'
                            : 'border-gray-200 bg-white dark:border-dark-600 dark:bg-dark-800'
                        }`}>
                        <button
                          type="button"
                          className="flex-1 text-left"
                          onClick={() => setSelectedPromotionIndex(idx)}>
                          <div className="font-medium text-gray-800 dark:text-dark-100">
                            {p.name?.trim() || `Promo ${String(idx + 1).padStart(2, '0')}`}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-dark-300">
                            Template:{' '}
                            {bonusTemplates.find((t) => t.value === p.bonusTemplate)?.label ||
                              p.bonusTemplate ||
                              '—'}
                          </div>
                        </button>
                        <Button
                          type="button"
                          isIcon
                          variant="flat"
                          color="error"
                          className="ml-2 size-8"
                          onClick={() => handleRemovePromotion(idx)}>
                          <XMarkIcon className="size-4.5" />
                        </Button>
                      </div>
                    ))}
                    {promotions.length === 0 && (
                      <div className="rounded-md border border-dashed border-gray-300 p-3 text-center text-xs text-gray-500 dark:border-dark-600 dark:text-dark-300">
                        {t('no_data') || 'No promotions added yet'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {selectedPromotionIndex == null ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-dark-600 dark:text-dark-300">
                      <p className="mb-3">{t('select') || 'Select a promotion to edit'}</p>
                      <Button type="button" size="sm" onClick={handleAddPromotion}>
                        {t('add')}
                      </Button>
                    </div>
                  ) : (
                    (() => {
                      const p = promotions[selectedPromotionIndex] || {};
                      return (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                              label="Name (internal)*"
                              value={p.name}
                              onChange={(e) => updateSelectedPromotion('name', e.target.value)}
                              placeholder="e.g. Promo 01"
                            />
                            <Select
                              label="Bonus Template"
                              value={p.bonusTemplate}
                              onChange={(e) =>
                                updateSelectedPromotion('bonusTemplate', e.target.value)
                              }
                              placeholder="Choose bonus template"
                              data={bonusTemplates}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                              label="Priority"
                              value={p.priority}
                              onChange={(e) => updateSelectedPromotion('priority', e.target.value)}
                              type="number"
                              placeholder="e.g. 1"
                            />
                            <Input
                              label="Cooldown (optional)"
                              value={p.cooldown}
                              onChange={(e) => updateSelectedPromotion('cooldown', e.target.value)}
                              placeholder="e.g., 48h or 24:00"
                            />
                          </div>
                          <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
                            <div className="mb-2 font-medium text-gray-800 dark:text-dark-100">
                              Max Claims per Player
                            </div>
                            {/* Add buttons for claim types not yet added */}
                            <div className="mb-3 flex flex-wrap gap-2">
                              {!p.maxClaims?.days && (
                                <button
                                  type="button"
                                  onClick={() => updateSelectedPromotion('maxClaims.days', '1')}
                                  className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-700">
                                  <span>+</span> Days
                                </button>
                              )}
                              {!p.maxClaims?.week && (
                                <button
                                  type="button"
                                  onClick={() => updateSelectedPromotion('maxClaims.week', '1')}
                                  className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-700">
                                  <span>+</span> Week
                                </button>
                              )}
                              {!p.maxClaims?.month && (
                                <button
                                  type="button"
                                  onClick={() => updateSelectedPromotion('maxClaims.month', '1')}
                                  className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-700">
                                  <span>+</span> Month
                                </button>
                              )}
                              {!p.maxClaims?.lifetime && (
                                <button
                                  type="button"
                                  onClick={() => updateSelectedPromotion('maxClaims.lifetime', '1')}
                                  className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-700">
                                  <span>+</span> Lifetime
                                </button>
                              )}
                            </div>

                            {/* Display active claim fields */}
                            <div className="space-y-2">
                              {p.maxClaims?.days && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    label="day"
                                    value={p.maxClaims.days}
                                    onChange={(e) =>
                                      updateSelectedPromotion('maxClaims.days', e.target.value)
                                    }
                                    type="number"
                                    min="0"
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedPromotion('maxClaims.days', undefined)
                                    }
                                    className="hover:text-error-600 mt-6 flex h-9 w-9 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700">
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                              {p.maxClaims?.week && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    label="week"
                                    value={p.maxClaims.week}
                                    onChange={(e) =>
                                      updateSelectedPromotion('maxClaims.week', e.target.value)
                                    }
                                    type="number"
                                    min="0"
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedPromotion('maxClaims.week', undefined)
                                    }
                                    className="hover:text-error-600 mt-6 flex h-9 w-9 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700">
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                              {p.maxClaims?.month && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    label="month"
                                    value={p.maxClaims.month}
                                    onChange={(e) =>
                                      updateSelectedPromotion('maxClaims.month', e.target.value)
                                    }
                                    type="number"
                                    min="0"
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedPromotion('maxClaims.month', undefined)
                                    }
                                    className="hover:text-error-600 mt-6 flex h-9 w-9 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700">
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                              {p.maxClaims?.lifetime && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    label="lifetime"
                                    value={p.maxClaims.lifetime}
                                    onChange={(e) =>
                                      updateSelectedPromotion('maxClaims.lifetime', e.target.value)
                                    }
                                    type="number"
                                    min="0"
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedPromotion('maxClaims.lifetime', undefined)
                                    }
                                    className="hover:text-error-600 mt-6 flex h-9 w-9 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700">
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {!p.maxClaims?.days &&
                              !p.maxClaims?.week &&
                              !p.maxClaims?.month &&
                              !p.maxClaims?.lifetime && (
                                <p className="text-sm text-gray-500 dark:text-dark-400">
                                  No limits set. Player can keep receiving this promotion unless
                                  campaign-level cap blocks further claims.
                                </p>
                              )}
                          </div>

                          <Input
                            label="Title (player UI)"
                            value={p.title}
                            onChange={(e) => updateSelectedPromotion('title', e.target.value)}
                            placeholder="e.g. 50% Reload Bonus"
                          />

                          <Textarea
                            label="Description"
                            value={p.description}
                            onChange={(e) => updateSelectedPromotion('description', e.target.value)}
                            rows={3}
                            placeholder="Description"
                          />

                          <div className="space-y-2">
                            <div className="flex items-end gap-2">
                              <Input
                                label="Image URL"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                placeholder="https://..."
                              />
                              <Button
                                type="button"
                                className="h-9"
                                onClick={addImageUrl}
                                disabled={!imageUrlInput.trim()}>
                                {t('add')}
                              </Button>
                            </div>
                            {(p.imageUrls || []).length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {p.imageUrls.map((url) => (
                                  <span
                                    key={url}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-dark-700 dark:text-dark-200">
                                    <span className="max-w-[280px] truncate">{url}</span>
                                    <button
                                      type="button"
                                      className="rounded-sm hover:bg-gray-200 dark:hover:bg-dark-600"
                                      onClick={() => removeImageUrl(url)}>
                                      <XMarkIcon className="size-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>

            {/* Re-Issuance Policy */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                6. Re-Issuance Policy
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Control how bonuses may be re-issued.
              </p>

              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <Radio
                    label="One bonus per player at a time"
                    value="one"
                    checked={formValues.reIssuancePolicy === 'one'}
                    onChange={(e) => setValue('reIssuancePolicy', e.target.value)}
                  />
                  <Radio
                    label="Re-issue even if player has an active one"
                    value="reissue"
                    checked={formValues.reIssuancePolicy === 'reissue'}
                    onChange={(e) => setValue('reIssuancePolicy', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Radio
                      label="Allow stacking up to"
                      value="stack"
                      checked={formValues.reIssuancePolicy === 'stack'}
                      onChange={(e) => setValue('reIssuancePolicy', e.target.value)}
                    />
                    <Input
                      {...register('allowStackN')}
                      className="w-24"
                      type="number"
                      min="1"
                      placeholder="2"
                      disabled={formValues.reIssuancePolicy !== 'stack'}
                      error={errors?.allowStackN?.message}
                    />
                    <span className="text-sm text-gray-600 dark:text-dark-200">active bonuses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review & Launch Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
                7. Review & Launch
              </h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
                Read-only summary and payload preview.
              </p>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">
                    Basic Information
                  </h4>
                  <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">Name:</span>
                      <span className="break-all text-gray-600 dark:text-dark-200">
                        {formValues.campaignName || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">Status:</span>
                      <span className="capitalize text-gray-600 dark:text-dark-200">
                        {formValues.status || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Start Date:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.startDate
                          ? new Date(formValues.startDate).toLocaleString()
                          : '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        End Date:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.endDate ? new Date(formValues.endDate).toLocaleString() : '-'}
                      </span>
                    </div>
                    <div className="col-span-2 grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Description:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.description || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Targeting */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">Targeting</h4>
                  <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Target Segment:
                      </span>
                      <span className="break-all text-gray-600 dark:text-dark-200">
                        {formValues.targetSegment?.label || formValues.targetSegment || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Include Players:
                      </span>
                      <span className="truncate text-gray-600 dark:text-dark-200">
                        {formValues.forceIncludePlayers || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Exclude Players:
                      </span>
                      <span className="truncate text-gray-600 dark:text-dark-200">
                        {formValues.forceExcludePlayers || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">
                    Triggers & Schedule
                  </h4>
                  <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        On Segment Entry:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.onSegmentEntry ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        On Segment Exit:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.onSegmentExit ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Recurring:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.recurring ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {formValues.recurring && (
                      <>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <span className="font-medium text-gray-700 dark:text-dark-100">
                            Schedule Days:
                          </span>
                          <span className="text-gray-600 dark:text-dark-200">
                            {formValues.scheduleDays?.join(', ') || '-'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <span className="font-medium text-gray-700 dark:text-dark-100">
                            Schedule Time:
                          </span>
                          <span className="text-gray-600 dark:text-dark-200">
                            {formValues.scheduleTime || '-'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bonus Removal */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">
                    Bonus Removal Rules
                  </h4>
                  <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Remove After Time:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.removeAfterTimeEnabled
                          ? `${formValues.removeAfterTimeValue} ${formValues.removeAfterTimeUnit}`
                          : 'No'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Remove on Exit:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.removeOnExitSegment ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Fixed Cutoff Date:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.fixedCutoffDate
                          ? new Date(formValues.fixedCutoffDate).toLocaleString()
                          : '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">
                        Max Claims Across:
                      </span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.maxClaimsAcrossPromotions || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Re-Issuance Policy */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">
                    Re-Issuance Policy
                  </h4>
                  <div className="grid gap-x-8 gap-y-3 text-sm">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium text-gray-700 dark:text-dark-100">Policy:</span>
                      <span className="text-gray-600 dark:text-dark-200">
                        {formValues.reIssuancePolicy === 'one'
                          ? 'One bonus per player at a time'
                          : formValues.reIssuancePolicy === 'reissue'
                            ? 'Re-issue even if player has an active one'
                            : formValues.reIssuancePolicy === 'stack'
                              ? `Allow stacking up to ${formValues.allowStackN || 0} active bonuses`
                              : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promotions */}
                {promotions.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-dark-50">
                      Promotions ({promotions.length})
                    </h4>
                    <div className="space-y-3">
                      {promotions.map((promo, idx) => (
                        <div
                          key={promo.id}
                          className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
                          <div className="mb-2 font-medium text-gray-900 dark:text-dark-50">
                            {idx + 1}. {promo.name || 'Unnamed Promotion'}
                          </div>
                          <div className="grid gap-2 text-xs text-gray-600 dark:text-dark-200">
                            <div>
                              <span className="font-medium">Template: </span>
                              {promo.bonusTemplate || '-'}
                            </div>
                            <div>
                              <span className="font-medium">Priority: </span>
                              {promo.priority || '-'}
                            </div>
                            {promo.cooldown && (
                              <div>
                                <span className="font-medium">Cooldown: </span>
                                {promo.cooldown}h
                              </div>
                            )}
                            {(promo.maxClaims?.days ||
                              promo.maxClaims?.week ||
                              promo.maxClaims?.month ||
                              promo.maxClaims?.lifetime) && (
                              <div>
                                <span className="font-medium">Max Claims: </span>
                                {[
                                  promo.maxClaims?.days && `${promo.maxClaims.days}/day`,
                                  promo.maxClaims?.week && `${promo.maxClaims.week}/week`,
                                  promo.maxClaims?.month && `${promo.maxClaims.month}/month`,
                                  promo.maxClaims?.lifetime &&
                                    `${promo.maxClaims.lifetime}/lifetime`
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
