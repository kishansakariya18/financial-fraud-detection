import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Page } from 'components/shared/Page';
import { Button, Circlebar, Input, Upload } from 'components/ui';
import RenderImage from 'components/ui/custom/ImageRender';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ProviderService from 'services/provider.services';

import { toast } from 'sonner';
import { editProviderSchema } from './schema';

export function EditProvider({ providerName = '', value = '', providerId, closeModal = () => {} }) {
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const uploadRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [response, setResponse] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editProviderSchema),
    defaultValues: {
      providerName
    }
  });

  const editProviderApi = async (data) => {
    setLoading(true);
    setError(null);
    const result = await ProviderService.editProvider(providerId, data, file);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
        closeModal();
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    closeModal();
  }
  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  const onSubmit = async (data) => {
    await editProviderApi(data);
  };

  return (
    <Page title={t('casino_provider')}>
      {!loading && (
        <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-1">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="mt-6 space-y-4">
              <Input
                {...register('providerName', {
                  onChange: () => setIsUpdated(true)
                })}
                label={t('casino_provider') + ' ' + t('name')}
                error={errors?.providerName?.message}
                placeholder={t('enter') + ' ' + t('casino_provider') + ' ' + t('name')}
              />
            </div>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-1">
                {(value || preview) && (
                  <RenderImage
                    preview={preview}
                    value={value}
                    id={'providerImage'}
                    label="Icon :"
                  />
                )}
                <Upload
                  onChange={(f) => {
                    setFile(f);
                    setIsUpdated(true);
                  }}
                  ref={uploadRef}
                  setPreview={setPreview}
                  accept={'image/*'}>
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
                    setIsUpdated(true);
                  }}>
                  Reset
                </Button>
              </div>
              {file && (
                <div>
                  File name : <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                type="submit"
                className="min-w-[7rem]"
                color="primary"
                disabled={loading || !isUpdated}>
                {t('update')}
              </Button>
            </div>
          </form>
        </div>
      )}
      {loading && (
        <div className="flex justify-center">
          <Circlebar size={12} strokeWidth={8} color="error" isIndeterminate />
        </div>
      )}
    </Page>
  );
}
