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
import EmailTemplateService from 'services/email-template.services';
import { emailTemplateSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { emailTemplateOptions, emailTemplateStatusToAPP } from './helper';
import { htmlToDelta } from 'utils/quillUtils';

const EditEmailTemplate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { templateId } = useParams();
  const [templateTextError, setTemplateError] = useState();

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const { t } = useTranslation();
  // console.log('htmlContent:', htmlContent);

  const breadcrumbItem = [
    { title: t('emailTemplate'), path: '/email-template' },
    { title: t('edit') }
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(emailTemplateSchema)
  });

  const [content, setContent] = useState(new Delta([{ insert: htmlContent }]));

  const title = watch('title');

  const handleChange = (val) => {
    // console.log('handleChange: ', val);

    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    const html = quill.root.innerHTML;
    setHtmlContent(html);
    const plainText = html.replace(/<(.|\n)*?>/g, '').trim();
    if (plainText) {
      setTemplateError('');
    }
  };

  const editEmailTemplateAPI = async (requestObject) => {
    // console.log('requestObject: ', requestObject);

    setLoading(true);
    setError(null);
    const result = await EmailTemplateService.emailTemplateUpdate(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  const fetchEmailTemplateDetails = async () => {
    try {
      const result = await EmailTemplateService.emailTemplateDetail(templateId);
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
    if (templateId) {
      fetchEmailTemplateDetails().then((result) => {
        if (result) {
          const mappedData = {
            title: result?.Title,
            slug: result?.Slug,
            heading: result?.Subject,
            cc: result?.CC || '',
            bcc: result?.BCC || '',
            to: result?.ToEmail || '',
            status: result.IsActive ? emailTemplateStatusToAPP(result.IsActive) : undefined
          };
          const quill = new Quill(document.createElement('div'));
          quill.root.innerHTML = result?.BodyHtml || '';
          quill.setContents(result?.BodyHtml);
          const delta = htmlToDelta(result?.BodyHtml);
          setHtmlContent(result?.BodyHtml || '');

          setContent(delta);

          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    navigate('/email-template');
    setResponse(null);
    fetchEmailTemplateDetails();
  }

  const onSubmit = async (data) => {
    // const contentHTML = htmlContent?.replace(/<(.|\n)*?>/g, '').trim(); // Strip HTML tags

    if (+content.ops.length === 0) {
      setTemplateError('Template content is required');
      return;
    }

    await editEmailTemplateAPI({ ...data, template: htmlContent, emailTemplateId: templateId });
  };
  console.log('title: ', title);
  return (
    <Page title={t('edit') + ' ' + t('emailTemplate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('emailTemplate') + ' ' + t('form')}
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
                key={'title'}
                {...register('title')}
                label={t('title')}
                error={errors?.title?.message}
                placeholder={t('enter') + ' ' + t('title')}
              />
              <Input
                {...register('slug')}
                key={'slug'}
                label={t('slug')}
                error={errors?.slug?.message}
                placeholder={t('enter') + ' ' + t('slug')}
                disabled
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                key={'heading'}
                {...register('heading')}
                label={t('subject')}
                error={errors?.heading?.message}
                placeholder={t('enter') + ' ' + t('subject')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="mt-1 max-w-xl">
                <TextEditor
                  key={'template'}
                  value={content}
                  label={t('template')}
                  onChange={handleChange}
                  placeholder={
                    t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                  }
                  error={templateTextError ? templateTextError : undefined}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                {...register('to')}
                key={'to'}
                label={t('to')}
                error={errors?.to?.message}
                placeholder={t('enter') + ' ' + t('to')}
              />
              <Input
                {...register('cc')}
                label={'CC'}
                key={'cc'}
                error={errors?.cc?.message}
                placeholder={t('enter') + ' ' + 'CC'}
              />
              <Input
                {...register('bcc')}
                label={'BCC'}
                key={'bcc'}
                error={errors?.bcc?.message}
                placeholder={t('enter') + ' ' + 'BCC'}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'status'}
                    data={emailTemplateOptions}
                    value={
                      emailTemplateOptions.find((status) => status.value === field.value) || null
                    }
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

export default EditEmailTemplate;
