// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Radio, Upload } from 'components/ui';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import { placementTypeOptions } from './helper';
import { DatePicker } from 'components/shared/form/Datepicker';

import SegmentationService from 'services/segmentation.services';
import { createBannerSchema } from './schema';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import RenderImage from 'components/ui/custom/ImageRender';
import BannerService from 'services/banner.services';

const EditBanner = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [segmentationType, setSegmentationType] = useState('all');
  const [segmentationList, setSegmentationList] = useState([]);
  const [segmentationIds, setSegmentationIds] = useState([]);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const uploadRef = useRef();

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('banner'), path: '/content-management/banner' },
    { title: t('create') }
  ];

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
    control,
    reset
  } = useForm({
    resolver: yupResolver(createBannerSchema)
  });

  console.log('errors: ', errors);

  // const isOnlyFirstDeposit = watch('isOnlyFirstDeposit');
  // const isOnlySecondDeposit = watch('isOnlySecondDeposit');

  const createBannerAPI = async (requestObject) => {
    console.log('requestObject: ', requestObject);

    setLoading(true);
    setError(null);
    const result = await BannerService.createBanner(requestObject, file);
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
    setSegmentationType('all');
    setSegmentationIds([]);
  }

  const onSubmit = async (data) => {
    const apiData = {
      segmentationType,
      segmentationIds
    };
    console.log('{ ...data, ...apiData }: ', { ...data, ...apiData });

    await createBannerAPI({ ...data, ...apiData });
  };
  return (
    <Page title={t('create') + ' ' + t('banner')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('banner') + ' ' + t('form')}
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
                // <CustomSelect
                //   id="segmemtation"
                //   showLabel={t('select') + ' ' + t('segmentation')}
                //   options={segmentationOptions}
                //   isMulti={true}
                //   error={segmentationOptionsError}
                //   value={segmentationIds}
                //   onChange={handleSegmentationChange}
                // />
                <Controller
                  render={({ field }) => (
                    <Listbox
                      key={'segmemtation'}
                      data={segmentationOptions}
                      multiple={true}
                      value={
                        segmentationOptions.filter((status) =>
                          segmentationOptions.includes(status.value)
                        ) || null
                      }
                      onChange={(val) => {
                        console.log(val);
                        setSegmentationIds(val.map((option) => option.value));
                      }}
                      name={field.name}
                      label={t('banner') + ' ' + t('segmentation')}
                      placeholder={t('select') + ' ' + t('segmentation')}
                      displayField="label"
                      error={errors?.segmemtation?.message}
                    />
                  )}
                  control={control}
                  name="bannerType"
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
                  {preview && (
                    <RenderImage
                      preview={preview}
                      id={'bannerImage'}
                      label="Banner Image :"
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
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditBanner;
