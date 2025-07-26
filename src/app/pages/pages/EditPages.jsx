// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import PagesService from 'services/pages.services';
import { pagesSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { pagesOptions, pagesStatusToAPP } from './helper';
import { htmlToDelta } from 'utils/quillUtils';

const EditPages = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { pageID } = useParams();

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('pages'), path: '/content-management/pages' },
    { title: t('edit') }
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    // watch,
    reset
  } = useForm({
    resolver: yupResolver(pagesSchema)
  });

  const navigate = useNavigate();

  const [content, setContent] = useState(new Delta([{ insert: htmlContent }]));

  // const name = watch('name');

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
  };

  const editPagesAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PagesService.pagesUpdate(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
        setTimeout(() => {
          navigate('/content-management/pages');
        }, 0);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  const fetchPagesDetails = async () => {
    try {
      const result = await PagesService.pagesDetail(pageID);

      if (result) {
        if (result.status === 200 || result.status === 201) {
          return result.response.data;
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      console.log('err: ', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (pageID) {
      fetchPagesDetails().then((result) => {
        if (result) {
          const mappedData = {
            name: result?.Name,
            pageKey: result?.PageKey,
            content: result?.Content,
            status:
              result.IsActive === 1 || result.IsActive === 0
                ? pagesStatusToAPP(result.IsActive)
                : undefined
          };
          const quill = new Quill(document.createElement('div'));
          quill.root.innerHTML = result?.Content || '';
          quill.setContents(result?.Content);
          const delta = htmlToDelta(result?.Content);

          setHtmlContent(result?.Content || '');

          setContent(delta);

          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageID]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/content-management/pages');
    }, 0);
    setResponse(null);
    fetchPagesDetails();
  }

  const onSubmit = async (data) => {
    await editPagesAPI({ ...data, content: htmlContent, pageID: pageID });
  };
  return (
    <Page title={t('edit') + ' ' + t('page')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('page') + ' ' + t('form')}
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
                key={'name'}
                {...register('name')}
                label={t('name')}
                error={errors?.name?.message}
                placeholder={t('enter') + ' ' + t('name')}
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'status'}
                    data={pagesOptions}
                    value={pagesOptions.find((status) => status.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('status')}
                    placeholder={t('select') + ' ' + t('status')}
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
              />
              {/* <Input
                {...register('pageKey')}
                key={'pageKey'}
                label={t('pageKey')}
                value={name ? stringToPagekey(name) : undefined}
                error={errors?.pageKey?.message}
                placeholder={t('enter') + ' ' + t('pageKey')}
                disabled
              /> */}
            </div>
            {/* <div className="grid gap-4 sm:grid-cols-1">
              <Input
                key={'heading'}
                {...register('heading')}
                label={t('heading')}
                error={errors?.heading?.message}
                placeholder={t('enter') + ' ' + t('heading')}
              />
            </div> */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="mt-1 max-w-xl">
                <TextEditor
                  key={'content'}
                  value={content}
                  label={t('content')}
                  onChange={handleChange}
                  placeholder={
                    t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                  }
                  className="[&_.ql-editor]:max-h-40 [&_.ql-editor]:min-h-[12rem]"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
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

export default EditPages;
