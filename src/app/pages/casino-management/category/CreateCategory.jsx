import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomModal } from 'components/custom';
import { Page } from 'components/shared/Page';
import { Button, Input } from 'components/ui';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryService from 'services/category.services';
import { toast } from 'sonner';
import { validateSchema } from './validate';

export function CreateCategory({ tableFetch }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [modelState, setModelState] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validateSchema) });
  const handleState = (value) => {
    if (!value) {
      reset();
    }
    setModelState(value);
  };
  const createCategoryApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await CategoryService.createCategory(requestObject);
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
                    placeholder={t('enter') + ' ' + t('casino_category')}
                    {...register('name')}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
                  {t('add')}
                </Button>
              </div>
            </form>
          </div>
        </Page>
      </CustomModal>
    </>
  );
}
