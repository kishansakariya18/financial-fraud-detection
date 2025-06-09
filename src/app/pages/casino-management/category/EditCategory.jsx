import { Page } from 'components/shared/Page';
import { Button, Input } from 'components/ui';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryService from 'services/category.services';
import { toast } from 'sonner';

export function EditCategory({ value = '', categoryId, closeModal = () => {} }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      return {
        name: value
      };
    }
  });
  const editCategoryApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await CategoryService.editCategory(categoryId, requestObject);
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
                error={errors?.userName?.message}
                placeholder={t('enter') + ' ' + t('casino_category')}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}
