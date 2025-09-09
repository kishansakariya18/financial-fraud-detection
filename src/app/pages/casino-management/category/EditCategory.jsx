import { Page } from 'components/shared/Page';
import { Button, Circlebar, Input, Upload } from 'components/ui';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryService from 'services/category.services';
import { toast } from 'sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import { validateSchema } from './validate';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export function EditCategory({ value = '', image = '', categoryId, closeModal = () => {} }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const uploadRef = useRef();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validateSchema),
    defaultValues: async () => {
      return {
        name: value
      };
    }
  });
  const editCategoryApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await CategoryService.editCategory(categoryId, requestObject, file);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  if (!loading && !error && response) {
    closeModal();
    toast.success(response.message);
    setResponse(null);
  }
  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  console.log('image:', image);

  const onSubmit = async (data) => {
    await editCategoryApi(data);
  };
  return (
    <Page title={t('casino_category')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-1">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                {...register('name')}
                label={t('casino_category') + ' ' + t('name')}
                error={errors?.name?.message}
                placeholder={t('enter') + ' ' + t('casino_category')}
              />
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              {(image || preview) && (
                <RenderImage preview={preview} value={image} id={'providerImage'} label="Icon :" />
              )}
              <Upload
                onChange={(f) => {
                  setFile(f);
                }}
                ref={uploadRef}
                setPreview={setPreview}
                accept={'image/*'}>
                {({ ...props }) => (
                  <Button color="primary" {...props} className="space-x-2" disabled={loading}>
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
            {!loading && (
              <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
                {t('update')}
              </Button>
            )}
            {loading && <Circlebar size={8} strokeWidth={8} color="primary" isIndeterminate />}
          </div>
        </form>
      </div>
    </Page>
  );
}
