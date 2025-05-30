// Import Dependencies
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// import { useParams } from 'react-router';
import { Listbox } from 'components/shared/form/Listbox';
import HomePageService from 'services/home-page.services';
import { yupResolver } from '@hookform/resolvers/yup';
import { changeCategorySchema } from './schema';

const EditHomeCategory = ({ onClose, homeCategoryId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);

  const { t } = useTranslation();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(changeCategorySchema)
  });

  const editHomeCategory = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await HomePageService.editHomeCategory({
      homeCategoryId,
      categoryId: requestObject.category
    });
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const result = await HomePageService.getCategories();
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const apiData = result.response.data;

        const categoryOptions = apiData.map((data) => {
          return {
            value: data.CategoryID,
            label: data.Name
          };
        });

        setCategoryOptions(categoryOptions);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    onClose();
    reset();
  }

  const onSubmit = async (data) => {
    await editHomeCategory({ ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
      <div className="mt-2 space-y-4">
        <div className="max-w-xl">
          <Controller
            render={({ field }) => (
              <Listbox
                data={categoryOptions}
                value={categoryOptions.find((status) => status.value === field.value) || null}
                onChange={(val) => field.onChange(val.value)}
                name={field.name}
                label={t('category')}
                placeholder={t('select') + ' ' + t('category')}
                displayField="label"
                error={errors?.category?.message}
              />
            )}
            control={control}
            name="category"
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
  );
};

export default EditHomeCategory;
