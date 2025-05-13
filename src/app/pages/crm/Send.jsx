// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import CrmService from 'services/crm.services';
import { crmSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { mapSegmentationOptions, sendOptions } from './helper';
import SegmentationService from 'services/segmentation.services';
// import { getQueryParams } from 'utils/custom.utilities';
// import { DEFAULT_PAGE_INDEX } from 'constants/app.constant';
// import { stringToSlug } from 'utils/stringToSlug';
const defaultValue = new Delta();

const Send = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [searchParams, setSearchParams] = useSearchParams();

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const { t } = useTranslation();

  const breadcrumbItem = [{ title: t('crm'), path: '/crm' }, { title: t('send') }];

  // const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    // watch,
    reset
  } = useForm({
    resolver: yupResolver(crmSchema)
  });

  const [content, setContent] = useState(defaultValue);
  const [segmentationOptions, setSegmentationOptions] = useState(defaultValue);
  // const title = watch('title');

  //fetch user segmentation list
  const fetchSegmentations = async () => {
    // const pageIndex = 0;
    // const pageSize = 1000;
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
    console.log('here is the request : ', requestObject);

    const result = await CrmService.send(requestObject);
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
      navigate('/crm', { replace: true });
    }, 0);
    window.location.reload();
    setResponse(null);
  }

  const onSubmit = async (data) => {
    await send({ ...data, description: htmlContent });
  };

  useEffect(() => {
    console.log('Validation Errors:', errors);
  }, [errors]);

  useEffect(() => {
    fetchSegmentations();
  }, []);

  return (
    <Page title={t('create') + ' ' + t('crm')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('crm')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'channel'}
                    data={sendOptions}
                    value={sendOptions.find((channel) => channel.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('channel')}
                    placeholder={t('select') + ' ' + t('channel')}
                    displayField="label"
                    error={errors?.channel?.message}
                  />
                )}
                control={control}
                name="channel"
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'segmentationID'}
                    data={segmentationOptions}
                    // value={null}
                    onChange={(val) => {
                      field.onChange(val.value);
                    }}
                    name={field.name}
                    label={t('segmentation') + ' ' + t('list')}
                    placeholder={t('select') + ' ' + t('segmentation')}
                    displayField="label"
                    error={errors?.to?.message}
                  />
                )}
                control={control}
                name="segmentationID"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'subject'}
                {...register('subject')}
                label={t('subject')}
                error={errors?.subject?.message}
                placeholder={t('enter') + ' ' + t('subject')}
              />
              <TextEditor
                key={'description'}
                value={content}
                label={t('description')}
                onChange={handleChange}
                placeholder={
                  t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                }
              />
            </div>
          </div>
          <div className="mt-12 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
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
