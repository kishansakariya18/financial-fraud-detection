import { ChevronDoubleRightIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomModal } from 'components/custom';
import { Page } from 'components/shared/Page';
import { Button, Circlebar, Input, Upload } from 'components/ui';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryService from 'services/category.services';
import { toast } from 'sonner';
import { validateSchema } from './validate';
import RenderImage from 'components/ui/custom/ImageRender';

export function CreateCategory({ tableFetch, value = '' }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [modelState, setModelState] = useState(false);
  const uploadRef = useRef();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validateSchema) });
  const handleState = (value) => {
    if (!value) {
      reset();
      setPreview();
      setFile();
    }
    setModelState(value);
  };
  const createCategoryApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await CategoryService.createCategory(requestObject, file);
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
    toast.success(response.message);
    tableFetch(false);
    handleState(false);
    setResponse(null);
  }
  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  const onSubmit = async (data) => {
    await createCategoryApi(data);
  };
  return (
    <>
      <CustomModal
        show={modelState}
        title={t('add') + ' ' + t('casino_category')}
        btnTitle={t('add') + ' ' + t('casino_category')}
        btnClassName="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
        isShowBtn={true}
        btnColor="primary"
        onClose={() => handleState(false)}
        onOpen={() => handleState(true)}
        onOk={() => handleState(false)}>
        {/* {modelState && ( */}
        <Page title={t('casino_category')}>
          <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-1">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  <Input
                    prefix={<ChevronDoubleRightIcon className="size-5" />}
                    label={t('casino_category') + ' ' + t('name')}
                    error={errors?.name?.message}
                    disabled={loading}
                    placeholder={t('enter') + ' ' + t('casino_category')}
                    {...register('name')}
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
              </div>
              <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse">
                {!loading && (
                  <Button type="submit" disabled={loading} className="min-w-[7rem]" color="primary">
                    {t('add')}
                  </Button>
                )}
                {loading && <Circlebar size={8} strokeWidth={8} color="primary" isIndeterminate />}
              </div>
            </form>
          </div>
        </Page>
      </CustomModal>
    </>
  );
}
