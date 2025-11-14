// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Input, Radio } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Listbox } from 'components/shared/form/Listbox';
import { promocodeTypeOptions } from './helper';
import PromoCodeService from 'services/promocode.services';
import { PROMOCODE } from 'constants/app.constant';
import { CurrencyRupeeIcon, PercentBadgeIcon } from '@heroicons/react/24/outline';
import { DatePicker } from 'components/shared/form/Datepicker';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import AffiliateService from 'services/affiliates.services';
import SegmentationService from 'services/segmentation.services';
import GamesService from 'services/games.services';
import { createPromocodeSchema } from './schema';
import { CustomSelect } from 'components/custom/CustomSelect';
const defaultValue = new Delta();

const CreatePromocode = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('realCash');
  const [discountType, setDiscountType] = useState('fixed');
  const [influencerSegType, setInfluencerSegType] = useState('all');
  const [segmentationType, setSegmentationType] = useState('all');
  const [htmlContent, setHtmlContent] = useState('');
  const [content, setContent] = useState(defaultValue);
  const [displayMode, setDisplayMode] = useState('public');
  const [affiliateList, setAffiliateList] = useState([]);
  const [segmentationList, setSegmentationList] = useState([]);
  const [getCoreRequired, setCodeRequired] = useState('0');
  const [claimSettlement, setClaimSettlement] = useState('2');
  const [stackableWithOtherBonus, setStackableWithOtherBonus] = useState('0');
  const [wagringAppliedGames, setWagringAppliedGames] = useState('all');
  const [wagringGamesList, setWagringdGamesList] = useState([]);
  const [segmentationIds, setSegmentationIds] = useState([]);
  const [influencerSegIds, setInfluencerSegIds] = useState([]);
  const [wagersAppliedGameIds, setWagersAppliedGameIds] = useState([]);
  const [wagersAppliedGameError, setWagersAppliedGameError] = useState(null);
  const [segmentationOptionsError, setSegmentationOptionsError] = useState(null);
  const [influencerError, setInfluencerError] = useState(null);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [{ title: t('promocode'), path: '/promocode' }, { title: t('create') }];

  const navigate = useNavigate();

  const fetchInfluencerList = async () => {
    console.log('fetchInfluencerList callled');

    const result = await AffiliateService.getList({ pagination: false });
    if (result) {
      if (result.status === 200) {
        setAffiliateList(result.response.data);
      } else {
        toast.error(result.error);
      }
    }
  };
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
  const fetchWageringGamesList = async () => {
    console.log('wagering callled');
    const filters = {
      status: 1
    };

    const result = await GamesService.getGamesList({
      pagination: { page: 1, perPage: 10 },
      filters,
      isPaginationRequired: false
    });
    if (result) {
      if (result.status === 200) {
        setWagringdGamesList(result.response.data);
      } else {
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    fetchInfluencerList();
    fetchSegmentationList();
    fetchWageringGamesList();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset
  } = useForm({
    resolver: yupResolver(createPromocodeSchema)
  });

  console.log('erro: ', errors);

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
  };

  const type = watch('type');
  const isOnlyFirstDeposit = watch('isOnlyFirstDeposit');
  const isOnlySecondDeposit = watch('isOnlySecondDeposit');

  const createPromocodeAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PromoCodeService.createPromocode(requestObject);
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
      navigate('/promocode');
    }, 0);

    setResponse(null);
  }

  const influencerOptions = affiliateList.map((affiliate) => {
    return {
      value: affiliate.AffiliateID,
      label: affiliate.FirstName + ' ' + affiliate.LastName
    };
  });

  const segmentationOptions = segmentationList.map((segmentation) => {
    const mapping = {
      value: segmentation.UserSegmentID,
      label: segmentation.Name
    };
    return mapping;
  });

  const wagerGamesOptions = wagringGamesList.map((game) => {
    return {
      value: game.GameID,
      label: game.Name
    };
  });

  if (!loading && !error && response) {
    toast.success(response.message);

    setResponse(null);
    reset();
    setCurrency('realCash');
    setDiscountType('fixed');
    setDisplayMode('public');
    setCodeRequired('0');
    setClaimSettlement('2');
    setStackableWithOtherBonus('0');
    setInfluencerSegType('all');
    setSegmentationType('all');
    setWagringAppliedGames('all');
    setWagersAppliedGameIds([]);
    setSegmentationIds([]);
    setInfluencerSegIds([]);
  }

  const handleInfluencerSegmentationChange = (selected) => {
    setInfluencerSegIds(selected);
    setInfluencerError(selected ? '' : 'AffiliateID required.');
  };
  const handleSegmentationChange = (selected) => {
    setSegmentationIds(selected);
    setSegmentationOptionsError(selected ? '' : 'SegmentationID required.');
  };

  const handleWagerAppliedGamesChange = (selected) => {
    setWagersAppliedGameIds(selected);
    setWagersAppliedGameError(selected ? '' : 'GameID required.');
  };

  const onSubmit = async (data) => {
    const apiData = {
      displayMode,
      influencerSegType,
      segmentationType,
      discountType,
      description: htmlContent,
      influencerSegIds,
      segmentationIds,
      currency,
      getCoreRequired,
      claimSettlement,
      stackableWithOtherBonus,
      wagringAppliedGames,
      wagersAppliedGameIds
    };
    console.log('{ ...data, ...apiData }: ', { ...data, ...apiData });

    await createPromocodeAPI({ ...data, ...apiData });
  };
  return (
    <Page title={t('create') + ' ' + t('promocode')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('promocode') + ' ' + t('form')}
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
                key={'promocode'}
                {...register('promocode')}
                label={t('promocode')}
                error={errors?.promocode?.message}
                placeholder={t('enter') + ' ' + t('promocode')}
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'type'}
                    data={promocodeTypeOptions}
                    value={
                      promocodeTypeOptions.find((status) => status.value === field.value) || null
                    }
                    defaultValue={promocodeTypeOptions.find(
                      (status) => status.value === PROMOCODE.TYPE.EXACT_DEPOSIT
                    )}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('depositRequirement') + ' ' + t('type')}
                    placeholder={t('select') + ' ' + t('type')}
                    displayField="label"
                    error={errors?.type?.message}
                  />
                )}
                control={control}
                name="type"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('currency')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('realCash')}
                    value="realCash"
                    checked={currency === 'realCash'}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                  <Radio
                    label={t('bonus')}
                    value="bonus"
                    checked={currency === 'bonus'}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                  <Radio
                    label={t('winning')}
                    value="winning"
                    checked={currency === 'winning'}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1">{t('discount') + ' ' + t('type')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('fixed')}
                    value="fixed"
                    checked={discountType === 'fixed'}
                    onChange={(e) => setDiscountType(e.target.value)}
                  />
                  <Radio
                    label={t('percentage')}
                    value="percentage"
                    checked={discountType === 'percentage'}
                    onChange={(e) => setDiscountType(e.target.value)}
                    disabled={+type === PROMOCODE.TYPE.DEPOSIT_IN_RANGE}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">
                  {t('influencer') + ' ' + t('segmentation') + ' ' + t('type')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('all')}
                    value="all"
                    checked={influencerSegType === 'all'}
                    onChange={(e) => setInfluencerSegType(e.target.value)}
                  />
                  <Radio
                    label={t('specific')}
                    value="specific"
                    checked={influencerSegType === 'specific'}
                    onChange={(e) => setInfluencerSegType(e.target.value)}
                  />
                </div>
              </div>

              {influencerSegType === 'specific' && (
                <CustomSelect
                  id="wagerGamesOptions"
                  showLabel={t('select') + ' ' + t('segmentation')}
                  options={influencerOptions}
                  isMulti={true}
                  error={influencerError}
                  value={influencerSegIds}
                  onChange={handleInfluencerSegmentationChange}
                />
              )}
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
                <CustomSelect
                  id="wagerGamesOptions"
                  showLabel={t('select') + ' ' + t('segmentation')}
                  options={segmentationOptions}
                  isMulti={true}
                  error={segmentationOptionsError}
                  value={segmentationIds}
                  onChange={handleSegmentationChange}
                />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'wagering'}
                {...register('wagering')}
                label={`${t('wagering')} (Ex : 10x,20x)`}
                error={errors?.wagering?.message}
                placeholder={t('enter') + ' ' + t('amount')}
                step="any"
                type="number"
              />
              <Input
                key={'wagerFreeBounus'}
                prefix={<PercentBadgeIcon className="size-5" />}
                {...register('wagerFreeBounus')}
                label={`${t('wagerFreeBounus')} (%)`}
                error={errors?.wagerFreeBounus?.message}
                placeholder={t('enter') + ' ' + t('amount')}
                step="any"
                type="number"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('codeRequired')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('no')}
                    value="0"
                    checked={getCoreRequired === '0'}
                    onChange={(e) => setCodeRequired(e.target.value)}
                  />
                  <Radio
                    label={t('yes')}
                    value="1"
                    checked={getCoreRequired === '1'}
                    onChange={(e) => setCodeRequired(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1">{t('claimSettlement')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('manualCredit')}
                    value="2"
                    checked={claimSettlement === '2'}
                    onChange={(e) => setClaimSettlement(e.target.value)}
                  />
                  <Radio
                    label={t('autoCredit')}
                    value="1"
                    checked={claimSettlement === '1'}
                    onChange={(e) => setClaimSettlement(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('stackableWithOtherBonus')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('no')}
                    value="0"
                    checked={stackableWithOtherBonus === '0'}
                    onChange={(e) => setStackableWithOtherBonus(e.target.value)}
                  />
                  <Radio
                    label={t('yes')}
                    value="1"
                    checked={stackableWithOtherBonus === '1'}
                    onChange={(e) => setStackableWithOtherBonus(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('wagering') + ' ' + t('appliedGames')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('all')}
                    value="all"
                    checked={wagringAppliedGames === 'all'}
                    onChange={(e) => setWagringAppliedGames(e.target.value)}
                  />
                  <Radio
                    label={t('specific')}
                    value="specific"
                    checked={wagringAppliedGames === 'specific'}
                    onChange={(e) => setWagringAppliedGames(e.target.value)}
                  />
                </div>
              </div>

              {wagringAppliedGames === 'specific' && (
                <CustomSelect
                  id="wagerGamesOptions"
                  showLabel={t('select') + ' ' + t('wagering') + ' ' + t('appliedGames')}
                  options={wagerGamesOptions}
                  isMulti={true}
                  error={wagersAppliedGameError}
                  value={wagersAppliedGameIds}
                  onChange={handleWagerAppliedGamesChange}
                />
              )}
            </div>
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {+type === PROMOCODE.TYPE.EXACT_DEPOSIT && (
                  <Input
                    key={'exact-amount'}
                    {...register('exactAmount')}
                    label={t('exact') + ' ' + t('amount')}
                    error={errors?.exactAmount?.message}
                    placeholder={t('enter') + ' ' + t('amount')}
                    type="number"
                    step="any"
                  />
                )}
                {+type === PROMOCODE.TYPE.DEPOSIT_IN_RANGE && (
                  <div>
                    <div className="mb-2 mt-2">
                      <span>Diposit in Range </span>
                    </div>
                    <div className={'grid gap-4 sm:grid-cols-2'}>
                      <Input
                        key={'min-amount'}
                        {...register('minAmount')}
                        label={t('min') + ' ' + t('amount')}
                        error={errors?.minAmount?.message}
                        placeholder={t('min') + ' ' + t('amount')}
                        step="any"
                        type="number"
                      />
                      <Input
                        key={'max-amount'}
                        {...register('maxAmount')}
                        label={t('max') + ' ' + t('amount')}
                        error={errors?.maxAmount?.message}
                        placeholder={t('max') + ' ' + t('amount')}
                        step="any"
                        type="number"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
              {type === PROMOCODE.TYPE.DEPOSIT_IN_RANGE && (
                <Input
                  key={'benefitCap'}
                  {...register('benefitCap')}
                  label={t('benefitCap')}
                  error={errors?.benefitCap?.message}
                  placeholder={t('enter') + ' ' + t('benefitCap')}
                  step="any"
                  type="number"
                />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    onChange={onChange}
                    value={value || ''}
                    label={t('promocode') + ' ' + t('startAt')}
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
                    label={t('promocode') + ' ' + t('endAt')}
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

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Checkbox {...register('isOnlyFirstDeposit')} label={t('isOnlyFirstDeposit')} />
              <Checkbox {...register('isOnlySecondDeposit')} label={t('isOnlySecondDeposit')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'promocodeQty'}
                {...register('promocodeQty')}
                label={t('promocode') + ' ' + t('quantity')}
                error={errors?.promocodeQty?.message}
                type="number"
                placeholder={t('enter') + ' ' + t('promocode') + ' ' + t('quantity')}
                step="any"
              />
              {!(isOnlyFirstDeposit || isOnlySecondDeposit) && (
                <Input
                  key={'allowedPerUser'}
                  {...register('allowedPerUser')}
                  label={t('allowedPerUser')}
                  error={errors?.allowedPerUser?.message}
                  type="number"
                  step="any"
                  placeholder={t('enter') + ' ' + t('user') + ' ' + t('limit')}
                />
              )}
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

              <div>
                <p className="mb-1">{t('displayMode')}</p>
                <div className="flex flex-wrap gap-2">
                  <Radio
                    label={t('public_text')}
                    value="public"
                    checked={displayMode === 'public'}
                    onChange={(e) => setDisplayMode(e.target.value)}
                  />
                  <Radio
                    label={t('private_text')}
                    value="private"
                    checked={displayMode === 'private'}
                    onChange={(e) => setDisplayMode(e.target.value)}
                  />
                </div>
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

export default CreatePromocode;
