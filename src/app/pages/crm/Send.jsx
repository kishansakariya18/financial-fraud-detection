// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Radio } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import CrmService from 'services/crm.services';
import { crmSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { mapSegmentationOptions, mapUserClassOptions, sendOptions } from './helper';
import SegmentationService from 'services/segmentation.services';
import UserClassService from 'services/user-class.services';
import { DatePicker } from 'components/shared/form/Datepicker';

// import { getQueryParams } from 'utils/custom.utilities';
// import { DEFAULT_PAGE_INDEX } from 'constants/app.constant';
// import { stringToSlug } from 'utils/stringToSlug';
const defaultValue = new Delta();

const Send = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  // const navigate = useNavigate();

  const breadcrumbItems = [
    { title: t('crm_notifications'), path: '/crm/notifications' },
    { title: t('create') }
  ];

  const SendTimeType = [
    { value: 1, label: t('immediate') },
    { value: 2, label: t('schedule') }
  ];

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(crmSchema),
    defaultValues: {
      sendType: 1,
      channel: null,
      segmentationID: null,
      UserClassID: null,
      sendTo: 'segmentation'
    }
  });

  const [content, setContent] = useState(defaultValue);
  const [segmentationOptions, setSegmentationOptions] = useState([]);
  const [userClassOptions, setUserClassOptions] = useState([]);
  const watchSentType = watch('sendType');
  const watchSendTo = watch('sendTo');

  const fetchUserClasses = async () => {
    const result = await UserClassService.userclassList({
      pagination: { pageIndex: 0, pageSize: 1000 }
    });
    if (result.status === 200) {
      setUserClassOptions(mapUserClassOptions(result.response.data));
    }
  };

  const fetchSegmentations = async () => {
    const result = await SegmentationService.getAllSegmentationList();
    if (result.status === 200) {
      setSegmentationOptions(mapSegmentationOptions(result.response.data));
    }
  };

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
  };

  const send = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await CrmService.send(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
        resetForm();
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
    setResponse(null);
  }

  const onSubmit = async (data) => {
    await send({ ...data, description: htmlContent });
  };

  useEffect(() => {
    fetchSegmentations();
    fetchUserClasses();
  }, []);

  useEffect(() => {
    if (watchSendTo === 'segmentation') {
      setValue('UserClassID', null, { shouldValidate: true });
    } else if (watchSendTo === 'userClass') {
      setValue('segmentationID', null, { shouldValidate: true });
    }
  }, [watchSendTo, setValue]);

  const resetForm = () => {
    setContent(defaultValue);
    reset();
  };

  return (
    <Page title={t('create') + ' ' + t('crm')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center justify-between py-5 lg:py-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              {t('crm')}
            </h2>
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItems} className="max-sm:hidden" />
          </div>
          {/* <div className="flex items-center">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              {t('back')}
            </Button>
          </div> */}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Row 1 */}
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={sendOptions}
                  value={sendOptions.find((item) => item.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  name={field.name}
                  label={t('channel')}
                  placeholder={t('select') + ' ' + t('channel')}
                  displayField="label"
                  error={errors?.channel?.message}
                />
              )}
            />
            <div>
              <p className="mb-3 font-medium text-gray-700 dark:text-gray-200">{t('sendTo')}</p>
              <Controller
                name="sendTo"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Radio
                      {...field}
                      label={t('segmentation')}
                      value="segmentation"
                      checked={field.value === 'segmentation'}
                    />
                    <Radio
                      {...field}
                      label={t('userClass')}
                      value="userClass"
                      checked={field.value === 'userClass'}
                    />
                  </div>
                )}
              />
            </div>

            {/* Row 2 */}
            <Input
              {...register('subject')}
              label={t('subject')}
              error={errors?.subject?.message}
              placeholder={t('enter') + ' ' + t('subject')}
            />
            <Controller
              name="sendType"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={SendTimeType}
                  value={SendTimeType.find((item) => item.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  name={field.name}
                  label={t('sendType')}
                  placeholder={t('select') + ' ' + t('sendType')}
                  displayField="label"
                  error={errors?.sendType?.message}
                />
              )}
            />

            {/* Row 3: Conditional Fields */}
            <div className="min-h-[88px]">
              {watchSendTo === 'segmentation' ? (
                <Controller
                  name="segmentationID"
                  control={control}
                  render={({ field }) => (
                    <Listbox
                      data={segmentationOptions}
                      value={segmentationOptions.find((item) => item.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('segmentation')}
                      placeholder={t('select') + ' ' + t('segmentation')}
                      displayField="label"
                      error={errors?.segmentationID?.message}
                    />
                  )}
                />
              ) : watchSendTo === 'userClass' ? (
                <Controller
                  name="UserClassID"
                  control={control}
                  render={({ field }) => (
                    <Listbox
                      data={userClassOptions}
                      value={userClassOptions.find((item) => item.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('userClass')}
                      placeholder={t('select') + ' ' + t('userClass')}
                      displayField="label"
                      error={errors?.UserClassID?.message}
                    />
                  )}
                />
              ) : null}
            </div>

            <div className="min-h-[88px]">
              {parseInt(watchSentType) === 2 ? (
                <Controller
                  name="deliveryDateTime"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <DatePicker
                      onChange={onChange}
                      value={value || ''}
                      label={t('schedule')}
                      error={errors?.deliveryDateTime?.message}
                      options={{ disableMobile: true, enableTime: true, minDate: new Date() }}
                      placeholder="Choose date..."
                      {...rest}
                    />
                  )}
                />
              ) : null}
            </div>

            {/* Full-width row */}
            <div className="sm:col-span-2">
              <TextEditor
                value={content}
                label={t('description')}
                onChange={handleChange}
                placeholder={
                  t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                }
                className="[&_.ql-editor]:max-h-40 [&_.ql-editor]:min-h-[12rem]"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => resetForm()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('send')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default Send;
