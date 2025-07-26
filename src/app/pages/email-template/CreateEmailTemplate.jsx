// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { EmailInput } from 'components/custom/EmailInput';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import EmailTemplateService from 'services/email-template.services';
import { emailTemplateSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { emailTemplateOptions } from './helper';
import { stringToSlug } from 'utils/stringToSlug';
const defaultValue = new Delta();

const CreateEmailTemplate = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [templateTextError, setTemplateError] = useState();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('emailTemplate'), path: '/email-template' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {
      to: [],
      cc: [],
      bcc: []
    }
  });

  const [content, setContent] = useState(defaultValue);
  const title = watch('title');

  const handleChange = (val) => {
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

  const createEmailTemplateAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await EmailTemplateService.emailTemplateSubmit(requestObject);
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
      navigate('/email-template');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    const contentHTML = htmlContent?.replace(/<(.|\n)*?>/g, '').trim(); // Strip HTML tags

    if (!contentHTML) {
      setTemplateError('Template content is required');
      return;
    }

    // Send arrays directly to backend
    const requestData = {
      ...data,
      slug: stringToSlug(title),
      template: htmlContent
    };

    await createEmailTemplateAPI(requestData);
  };
  return (
    <Page title={t('create') + ' ' + t('emailTemplate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('emailTemplate') + ' ' + t('form')}
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
                value={title ? stringToSlug(title) : undefined}
                error={errors?.slug?.message}
                placeholder={t('enter') + ' ' + t('slug')}
                disabled
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                key={'heading'}
                {...register('heading')}
                label={t('heading')}
                error={errors?.heading?.message}
                placeholder={t('enter') + ' ' + t('heading')}
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
                  error={templateTextError && templateTextError}
                  className="[&_.ql-editor]:max-h-80 [&_.ql-editor]:min-h-[12rem]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <EmailInput
                    value={field.value}
                    onChange={field.onChange}
                    label={t('to')}
                    error={errors?.to?.message}
                    placeholder={t('enter') + ' ' + t('to')}
                  />
                )}
              />
              <Controller
                name="cc"
                control={control}
                render={({ field }) => (
                  <EmailInput
                    value={field.value}
                    onChange={field.onChange}
                    label={'CC'}
                    error={errors?.cc?.message}
                    placeholder={t('enter') + ' ' + 'CC'}
                  />
                )}
              />
              <Controller
                name="bcc"
                control={control}
                render={({ field }) => (
                  <EmailInput
                    value={field.value}
                    onChange={field.onChange}
                    label={'BCC'}
                    error={errors?.bcc?.message}
                    placeholder={t('enter') + ' ' + 'BCC'}
                  />
                )}
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
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateEmailTemplate;
