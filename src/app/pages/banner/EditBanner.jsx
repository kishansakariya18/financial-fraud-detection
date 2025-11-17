// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Radio, Upload } from 'components/ui';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { editBannerSchema } from './schema';
import { Listbox } from 'components/shared/form/Listbox';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import BannerService from 'services/banner.services';
import { placementTypeOptions } from './helper';
import SegmentationService from 'services/segmentation.services';
import { DatePicker } from 'components/shared/form/Datepicker';
import apiConfig from 'configs/api.config';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const EditBanner = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  // const [categoryOptions, setCategoryOptions] = useState([]);

  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [segmentationList, setSegmentationList] = useState([]);
  const [bannerImage, setBannerImage] = useState('');

  bannerImage;
  const uploadRef = useRef();
  const { t } = useTranslation();

  const navigate = useNavigate();

  console.log('preview: ', preview);

  const { bannerId } = useParams();

  const breadcrumbItem = [
    { title: t('banner'), path: '/content-management/banner' },
    { title: t('edit') }
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch
  } = useForm({
    resolver: yupResolver(editBannerSchema),
    defaultValues: {
      segmentationType: 0,
      segmentIds: []
    }
  });

  const segmentationType = watch('segmentationType');
  const segmentIds = watch('segmentIds');

  const fetchBannerDetails = async () => {
    const result = await BannerService.getBannerDetails(bannerId);

    if (result.status === 200) {
      const apiData = result.response.data;
      return apiData;
    } else {
      setError(result.error);
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

  useEffect(() => {
    fetchSegmentationList();
  }, []);

  useEffect(() => {
    if (bannerId) {
      fetchBannerDetails().then((result) => {
        if (result) {
          const mappedData = {
            bannerName: result.BannerName,
            placementType: result?.PlacementType || 0,
            segmentationType: result?.HasUserSegmentation || 0,
            segmentIds: result?.SegmentationIds?.map((s) => parseInt(s)) || [],
            startDate: getDateInUTCToTimeZone(result?.StartDate, undefined, 'YYYY-MM-DD HH:mm'),
            endDate: getDateInUTCToTimeZone(result?.EndDate, undefined, 'YYYY-MM-DD HH:mm'),
            bannerHeadline: result?.bannerContent[0]?.HeadLine,
            bannerSubHeadline: result?.bannerContent[0]?.SubHeadLine,
            targetUrl: result?.bannerContent[0]?.TargetURL,
            image: result?.bannerContent[0]?.MediaFileName
          };
          setBannerImage(result?.bannerContent[0]?.MediaFileName);
          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerId]);

  console.log('segmentationIds: ', segmentIds);

  const segmentationOptions = segmentationList.map((segmentation) => {
    const mapping = {
      value: segmentation.UserSegmentID,
      label: segmentation.Name
    };
    return mapping;
  });

  const editBannerAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await BannerService.editBanner(bannerId, requestObject, file);
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
    toast.success(response.message);

    setTimeout(() => {
      navigate('/content-management/banner');
    }, 0);

    setResponse(null);
  }

  useEffect(() => {}, [bannerId]);

  const onSubmit = async (data) => {
    const apiData = {
      ...data,
      segmentationIds: data.segmentIds
    };
    await editBannerAPI({ name: data.gameName, ...apiData });
  };
  return (
    <Page title={t('edit') + ' ' + t('banner')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('banner') + ' ' + t('form')}
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
                key={'bannerName'}
                {...register('bannerName')}
                label={t('banner') + ' ' + t('name')}
                error={errors?.bannerName?.message}
                placeholder={t('enter') + ' ' + t('banner') + ' ' + t('name')}
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'placementType'}
                    data={placementTypeOptions}
                    value={
                      placementTypeOptions.find((status) => status.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('placement') + ' ' + t('type')}
                    placeholder={t('select') + ' ' + t('type')}
                    displayField="label"
                    error={errors?.placementType?.message}
                  />
                )}
                control={control}
                name="placementType"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1">{t('segmentation') + ' ' + t('type')}</p>
                <div className="flex flex-wrap gap-2">
                  <Controller
                    name="segmentationType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Radio
                          label={t('all')}
                          value="0"
                          checked={(field.value ?? 0) === 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                        <Radio
                          label={t('specific')}
                          value="1"
                          checked={field.value === 1}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </>
                    )}
                  />
                </div>
                {errors?.segmentationType?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.segmentationType.message}</p>
                )}
              </div>

              {segmentationType === 1 && (
                <Controller
                  render={({ field }) => (
                    <Listbox
                      key={'segmentation'}
                      data={segmentationOptions}
                      multiple={true}
                      value={
                        segmentationOptions?.filter((opt) =>
                          (segmentIds || []).includes(opt.value)
                        ) || null
                      }
                      onChange={(val) => field.onChange(val.map((option) => option.value))}
                      name={field.name}
                      label={t('banner') + ' ' + t('segmentation')}
                      placeholder={t('select') + ' ' + t('segmentation')}
                      displayField="label"
                      error={errors?.segmentIds?.message}
                    />
                  )}
                  control={control}
                  name="segmentIds"
                />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    onChange={onChange}
                    value={value || ''}
                    label={t('banner') + ' ' + t('startAt')}
                    error={errors?.startDate?.message}
                    options={{
                      disableMobile: true,
                      time_24hr: true
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
                    label={t('banner') + ' ' + t('endAt')}
                    error={errors?.endDate?.message}
                    options={{
                      disableMobile: true,
                      time_24hr: true
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
                key={'bannerHeadline'}
                {...register('bannerHeadline')}
                label={t('banner') + ' ' + t('headline')}
                error={errors?.bannerHeadline?.message}
                type="text"
                placeholder={t('enter') + ' ' + t('banner') + ' ' + t('headline')}
              />
              <Input
                key={'bannerSubHeadline'}
                {...register('bannerSubHeadline')}
                label={t('banner') + ' ' + t('subHeadline')}
                error={errors?.bannerSubHeadline?.message}
                type="text"
                placeholder={t('enter') + ' ' + t('banner') + ' ' + t('subHeadline')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'targetUrl'}
                {...register('targetUrl')}
                label={t('targetUrl')}
                error={errors?.targetUrl?.message}
                type="text"
                placeholder={t('enter') + ' ' + t('targetUrl')}
              />
              <div className="ml-4 mt-5 w-40 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  {(preview || bannerImage) && (
                    <RenderImage
                      preview={preview}
                      id={'bannerImage'}
                      label="Banner Image :"
                      value={`${apiConfig.baseURL.S3_URL}/banner/${bannerImage}`}
                      maxWidth="300px"
                      maxHeight="300px"
                    />
                  )}
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
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditBanner;
