// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Radio, Upload } from 'components/ui';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import BonusCampaignService from 'services/bonus-campaign.services';
import { CloudArrowUpIcon, CurrencyRupeeIcon, PercentBadgeIcon } from '@heroicons/react/24/outline';
import { DatePicker } from 'components/shared/form/Datepicker';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import SegmentationService from 'services/segmentation.services';
import { createBonusCampaignSchema } from './schema';
import { Listbox } from 'components/shared/form/Listbox';
import RenderImage from 'components/ui/custom/ImageRender';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../casino-management/currencies/helper';
import CategoryService from 'services/category.services';
import UserClassService from 'services/user-class.services';
import { mapUserClassOptions } from './helper';
const defaultValue = new Delta();

const CreateBonusCampaign = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState('fixed');
  const [segmentationType, setSegmentationType] = useState('all');
  const [htmlContent, setHtmlContent] = useState('');
  const [content, setContent] = useState(defaultValue);
  const [segmentationList, setSegmentationList] = useState([]);
  const [claimSettlement, setClaimSettlement] = useState('AUTO');
  const [isKYCRequired, setIsKYCRequired] = useState('0');
  // const [currencyIds, setCurrencyIds] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [userClassOptions, setUserClassOptions] = useState([]);
  userClassOptions;
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('bonusCampaign'), path: '/bonus-campaign' },
    { title: t('create') }
  ];

  const navigate = useNavigate();

  const fetchSegmentationList = async () => {
    const result = await SegmentationService.getSegmentationList({ pagination: false });

    if (result) {
      if (result.status === 200) {
        setSegmentationList(result.response.data);
      } else {
        toast.error(result.error);
      }
    }
  };

  const fetchUserClasses = async () => {
    const result = await UserClassService.userclassList({
      pagination: { pageIndex: 0, pageSize: 1000 }
    });
    if (result.status === 200) {
      setUserClassOptions(mapUserClassOptions(result.response.data));
    }
  };

  const fetchCurrencies = async () => {
    try {
      const result = await CurrencyService.getCurrencyList({
        filters: { status: 'active' },
        pagination: { pageIndex: 0, pageSize: 1000 }
      });
      if (result.status === 200) {
        const mapped = currencyListResponseMapper(result.response);
        const options = (mapped.list || []).map((c) => ({
          value: c.code,
          label: `${c.name} (${c.code})`
        }));
        setCurrencyOptions(options);
      } else {
        toast.error(result.error || 'Failed to load currencies');
      }
    } catch (e) {
      console.error('Failed to load currencies:', e);
    }
  };

  const fetchCategoryList = async () => {
    const result = await CategoryService.getAllActiveCategories({
      isPaginationRequired: true,
      pagination: { perpage: 500 }
    });
    if (result) {
      if (result.status === 200) {
        // setSegmentationList(result.response.data);
        console.log('categories:', result.response.data);
        const mappedCategoryData = (result.response?.data || []).map((c) => ({
          value: c.CategoryID,
          label: `${c.Name}`
        }));
        setCategoryOptions(mappedCategoryData);
      } else {
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    fetchSegmentationList();
    fetchCurrencies();
    fetchCategoryList();
    fetchUserClasses();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(createBonusCampaignSchema),
    defaultValues: {
      eligibleCurrencies: [],
      wageringCategories: [],
      discountType: 'fixed'
    }
  });

  console.log('wageringRequirement:', watch('wageringRequirement'));

  const eligibleCurrencies = watch('eligibleCurrencies');
  const wageringCategories = watch('wageringCategories');
  const watchedDiscountType = watch('discountType');
  // const segmentationType = watch('segmentationType');

  // Sync discountType state with form value
  useEffect(() => {
    if (watchedDiscountType !== discountType) {
      setDiscountType(watchedDiscountType);
    }
  }, [watchedDiscountType, discountType]);

  console.log('erro: ', errors);

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
  };

  // const currencyOptions = [
  //   {
  //     value: 'INR',
  //     label: 'INR'
  //   },
  //   {
  //     value: 'USD',
  //     label: 'USD'
  //   }
  // ];

  // const categoryOptions = [
  //   {
  //     value: '1',
  //     label: 'category 1'
  //   },
  //   {
  //     value: '2',
  //     label: 'category 2'
  //   }
  // ];

  const wageringOptions = [
    {
      value: 'BONUS_ONLY',
      label: 'Bonus Only'
    },
    {
      value: 'DEPOSIT_PLUS_BONUS',
      label: 'Deposit + Bouns'
    }
  ];

  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const uploadRef = useRef();

  const createBonusCampaignAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await BonusCampaignService.createBonusCampaign(requestObject, file);
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

  if (!loading && !error && response) {
    // toast.success(response.message);
    setTimeout(() => {
      navigate('/bonus-campaign');
    }, 0);

    setResponse(null);
  }

  const segmentationOptions = segmentationList.map((segmentation) => {
    const mapping = {
      value: segmentation.UserSegmentID,
      label: segmentation.Name
    };
    return mapping;
  });

  if (!loading && !error && response) {
    toast.success(response.message);

    setResponse(null);
    reset();
    setDiscountType('fixed');
    setClaimSettlement('2');
    setSegmentationType('all');
  }

  const onSubmit = async (data) => {
    const apiData = {
      segmentationType,
      discountType,
      description: htmlContent,
      claimSettlement,
      campaignType: 'DEPOSIT_BONUS',
      isKYCRequired
    };
    console.log('{ ...data, ...apiData }: ', { ...data, ...apiData });

    await createBonusCampaignAPI({ ...data, ...apiData });
  };
  return (
    <Page title={t('create') + ' ' + t('bonusCampaign')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('bonusCampaign') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'campaignName'}
                {...register('campaignName')}
                label={t('campaignName')}
                error={errors?.campaignName?.message}
                placeholder={t('enter') + ' ' + t('campaignName')}
              />
              <Input
                key={'campaignCode'}
                {...register('campaignCode')}
                label={t('campaignCode')}
                error={errors?.campaignCode?.message}
                placeholder={t('enter') + ' ' + t('campaignCode')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'titleMessage'}
                {...register('titleMessage')}
                label={`${t('title')} ${t('message')}`}
                error={errors?.titleMessage?.message}
                placeholder={t('enter') + ' ' + t('titleMessage')}
              />
              <Input
                key={'shortMessage'}
                {...register('shortMessage')}
                label={`${t('short')} ${t('message')}`}
                error={errors?.shortMessage?.message}
                placeholder={t('enter') + ' ' + t('shortMessage')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('segmentation') + ' ' + t('type')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('all')}
                    value="all"
                    checked={segmentationType === 'all'}
                    onChange={(e) => setSegmentationType(e.target.value)}
                  />
                  <Radio
                    label={t('specific')}
                    value="specific"
                    checked={segmentationType === 'specific'}
                    onChange={(e) => setSegmentationType(e.target.value)}
                  />
                </div>
              </div>

              {segmentationType === 'specific' && (
                <Controller
                  render={({ field }) => (
                    <Listbox
                      key={'segmentationId'}
                      data={segmentationOptions}
                      value={segmentationOptions.find((seg) => seg.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('banner') + ' ' + t('segmentation')}
                      placeholder={t('select') + ' ' + t('segmentation')}
                      displayField="label"
                      error={errors?.segmentationId?.message}
                    />
                  )}
                  control={control}
                  name="segmentationId"
                />
              )}
              {/* {segmentationType === 'user-class' && (
                <Controller
                  render={({ field }) => (
                    <Listbox
                      key={'userClassIds'}
                      data={userClassOptions}
                      value={userClassOptions.find((seg) => seg.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('userClass')}
                      placeholder={t('select') + ' ' + t('userClass')}
                      displayField="label"
                      error={errors?.userClassIds?.message}
                    />
                  )}
                  control={control}
                  name="userClassIds"
                />
              )} */}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'wageringRequirement'}
                    data={wageringOptions}
                    value={wageringOptions.find((wOption) => wOption.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('wagering') + ' ' + t('requirement')}
                    placeholder={t('select') + ' ' + t('value')}
                    displayField="label"
                    error={errors?.wageringRequirement?.message}
                  />
                )}
                control={control}
                name="wageringRequirement"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'wageringMultiplier'}
                {...register('wageringMultiplier')}
                label={`${t('wagering')} ${t('multiplier')} (Ex : 10x,20x)`}
                error={errors?.wageringMultiplier?.message}
                placeholder={t('enter') + ' ' + t('value')}
                step="any"
                type="number"
              />

              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'currency'}
                    data={currencyOptions}
                    multiple={true}
                    // value={
                    //   currencyOptions?.filter((status) => currencyIds?.includes(status.value)) ||
                    //   null
                    // }
                    // onChange={(val) => {
                    //   console.log(val);
                    //   setCurrencyIds(val.map((option) => option.value));
                    // }}
                    value={
                      currencyOptions?.filter((opt) =>
                        (eligibleCurrencies || []).includes(opt.value)
                      ) || null
                    }
                    onChange={(val) => field.onChange(val.map((option) => option.value))}
                    name={field.name}
                    label={t('eligible') + ' ' + t('currency')}
                    placeholder={t('select') + ' ' + t('currency')}
                    displayField="label"
                    error={errors?.eligibleCurrencies?.message}
                  />
                )}
                control={control}
                name="eligibleCurrencies"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'category'}
                    data={categoryOptions}
                    multiple={true}
                    value={
                      categoryOptions?.filter((status) =>
                        wageringCategories?.includes(status.value)
                      ) || null
                    }
                    onChange={(val) => field.onChange(val.map((option) => option.value))}
                    name={field.name}
                    label={t('wagering') + ' ' + t('categories')}
                    placeholder={t('select') + ' ' + t('categories')}
                    displayField="label"
                    error={errors?.wageringCategories?.message}
                  />
                )}
                control={control}
                name="wageringCategories"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('claimSettlement')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('autoCredit')}
                    value="AUTO"
                    checked={claimSettlement === 'AUTO'}
                    onChange={(e) => setClaimSettlement(e.target.value)}
                  />
                  <Radio
                    label={t('manualCredit')}
                    value="MANUAL"
                    checked={claimSettlement === 'MANUAL'}
                    onChange={(e) => setClaimSettlement(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1">{t('isKYCRequired')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('yes')}
                    value="1"
                    checked={isKYCRequired === '1'}
                    onChange={(e) => setIsKYCRequired(e.target.value)}
                  />
                  <Radio
                    label={t('no')}
                    value="0"
                    checked={isKYCRequired === '0'}
                    onChange={(e) => setIsKYCRequired(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('discount') + ' ' + t('type')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('fixed')}
                    value="fixed"
                    checked={discountType === 'fixed'}
                    onChange={(e) => {
                      setDiscountType(e.target.value);
                      setValue('discountType', e.target.value);
                    }}
                  />
                  <Radio
                    label={t('percentage')}
                    value="percentage"
                    checked={discountType === 'percentage'}
                    onChange={(e) => {
                      setDiscountType(e.target.value);
                      setValue('discountType', e.target.value);
                    }}
                  />
                </div>
              </div>
              <Input
                key={'discount'}
                prefix={
                  discountType === 'fixed' ? (
                    <CurrencyRupeeIcon className="size-5" />
                  ) : (
                    <PercentBadgeIcon className="size-5" />
                  )
                }
                {...register('discount')}
                label={t('discount')}
                error={errors?.discount?.message}
                placeholder={t('enter') + ' ' + t('amount')}
                step="any"
                type="number"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'minDepositAmount'}
                {...register('minDepositAmount')}
                label={`${t('minimum')} ${t('deposit')} ${t('amount')}`}
                error={errors?.minDepositAmount?.message}
                placeholder={t('enter') + ' ' + t('amount')}
                step="any"
                type="number"
              />
              {discountType === 'percentage' && (
                <Input
                  key={'maxBonusAmount'}
                  {...register('maxBonusAmount')}
                  label={`${t('maximum')} ${t('bonus')} ${t('amount')}`}
                  error={errors?.maxBonusAmount?.message}
                  placeholder={t('enter') + ' ' + t('amount')}
                  step="any"
                  type="number"
                />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'cashoutMultiplier'}
                {...register('cashoutMultiplier')}
                label={`${t('cashout')} ${t('multiplier')} (Ex : 10x,20x)`}
                error={errors?.cashoutMultiplier?.message}
                placeholder={t('enter') + ' ' + t('value')}
                step="any"
                type="number"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    onChange={onChange}
                    value={value || ''}
                    label={t('bonusCampaign') + ' ' + t('startAt')}
                    error={errors?.startDate?.message}
                    options={{
                      disableMobile: true,
                      time_24hr: true,
                      minDate: new Date(new Date().setHours(0, 0, 0, 0))
                    }}
                    placeholder="Choose date..."
                    {...rest}
                  />
                )}
                control={control}
                name="startDate"
              />
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    onChange={onChange}
                    value={value || ''}
                    label={t('bonusCampaign') + ' ' + t('endAt')}
                    error={errors?.endDate?.message}
                    options={{
                      disableMobile: true,
                      time_24hr: true,
                      minDate: new Date(new Date().setHours(0, 0, 0, 0))
                    }}
                    placeholder="Choose date..."
                    {...rest}
                  />
                )}
                control={control}
                name="endDate"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'bonusQuantity'}
                {...register('bonusQuantity')}
                label={t('bonusCampaign') + ' ' + t('quantity')}
                error={errors?.bonusQuantity?.message}
                type="number"
                placeholder={t('enter') + ' ' + t('quantity')}
                step="any"
              />
              <Input
                key={'allowedPerUser'}
                {...register('allowedPerUser')}
                label={t('allowedPerUser')}
                error={errors?.allowedPerUser?.message}
                type="number"
                step="any"
                placeholder={t('enter') + ' ' + t('user') + ' ' + t('limit')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'bonusExpiryDays'}
                {...register('bonusExpiryDays')}
                label={`${t('bonus')} ${t('expiry')} ${t('days')}`}
                error={errors?.bonusExpiryDays?.message}
                type="number"
                step="any"
                placeholder={t('enter') + ' ' + t('days')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="mt-1 max-w-xl">
                <TextEditor
                  key={'description'}
                  value={content}
                  label={t('description')}
                  onChange={handleChange}
                  placeholder={t('enter') + ' ' + t('description') + ' ' + t('here') + '...'}
                />
              </div>
              <div className="ml-4 mt-5 w-40 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  {preview && <RenderImage preview={preview} id={'bonusImage'} label="Image :" />}
                  <Upload
                    onChange={setFile}
                    ref={uploadRef}
                    setPreview={setPreview}
                    accept={'.png'}>
                    {({ ...props }) => (
                      <Button color="primary" {...props} className="space-x-2">
                        <CloudArrowUpIcon className="size-5" />
                        <span>Choose File</span>
                      </Button>
                    )}
                  </Upload>
                  <Button
                    disabled={!file}
                    onClick={() => {
                      uploadRef.current.value = '';
                      setFile();
                      setPreview();
                    }}>
                    {t('reset')}
                  </Button>
                </div>
                {file && (
                  <div>
                    File name : <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateBonusCampaign;
