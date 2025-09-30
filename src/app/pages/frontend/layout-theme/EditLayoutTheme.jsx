// Import Dependencies
import { toast } from 'sonner';
import { Button, Card, Input } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import LayoutThemeService from 'services/layout-theme.services';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Listbox } from 'components/shared/form/Listbox';
import { layoutThemeTypeOptions } from './helper';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Page } from 'components/shared/Page';

export default function EditLayoutTheme() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [layoutList, setLayoutList] = useState([]);
  console.log('layoutList:', layoutList);
  const { layoutThemeID } = useParams();
  const breadcrumbItem = [
    { title: t('layoutTheme'), path: '/layout/layout-theme' },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      layoutValues: [{ label: '', value: '#FFFFFF', type: 1 }]
    }
  });

  const layoutValues = watch('layoutValues');

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (!isLoading && response) {
      toast.success(response.message);
      setResponse(null);
      navigate('/layout/layout-theme');
    }
  }, [isLoading, response, navigate]);

  const handleEditLayoutTheme = async (data) => {
    console.log('dataLL', data);
    data.layoutID = data.layoutList;
    data.layoutThemeID = layoutThemeID;
    delete data.layoutList;
    setIsLoading(true);
    setError('');
    const result = await LayoutThemeService.updateProvider(data);

    if (result.status === 200) {
      setResponse(result.response);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };
  const getLayoutList = async () => {
    setIsLoading(true);
    setError('');
    const result = await LayoutThemeService.getLayoutList();

    if (result.status === 200) {
      const layoutList = result.response?.data?.map((item) => ({
        label: item.Name,
        value: item.LayoutID,
        key: item.LayoutID
      }));
      setLayoutList(layoutList || []);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };
  const getDetail = async (layoutThemeID) => {
    setIsLoading(true);
    setError('');
    const result = await LayoutThemeService.getLayoutDetail(layoutThemeID);
    console.log('result of detail api::', result);

    if (result.status === 200) {
      const layoutDetail = result.response?.data || {};
      setValue('layoutList', layoutDetail.LayoutID);
      setValue('themeName', layoutDetail.ThemeName);
      const layoutValues = layoutDetail?.themeConfigurations?.map((item) => ({
        label: item.ConfigKey,
        value: item.ConfigValue,
        type: item.ValueType
      }));
      setValue('layoutValues', layoutValues);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };
  const addLayoutValue = () => {
    reset({
      ...watch(),
      layoutValues: [...layoutValues, { label: '', value: '#FFFFFF', type: 1 }]
    });
  };
  useEffect(() => {
    getLayoutList();
    getDetail(layoutThemeID);
  }, []);
  const deleteLayoutValue = (index) => {
    const currentLayoutValue = [...layoutValues];
    currentLayoutValue.splice(index, 1);
    reset({
      ...watch(),
      layoutValues: currentLayoutValue
    });
  };

  const handleReset = () => {
    getDetail(layoutThemeID);
  };
  console.log('layoutValues', errors);

  return (
    <Page title={t('edit') + ' ' + t('theme')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('theme') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(handleEditLayoutTheme)} autoComplete="off">
          <div className="w-full max-w-5xl">
            <div className="mb-6">
              <Controller
                name={'layoutList'}
                control={control}
                rules={{ required: 'Layout Required' }}
                render={({ field }) => (
                  <Listbox
                    data={layoutList}
                    value={layoutList.find((opt) => opt.value === field.value) || null}
                    label={t('layout')}
                    onChange={(val) => field.onChange(val.value)}
                    placeholder={`${t('select')} ${t('option')}`}
                    displayField="label"
                    error={errors.layoutList?.message}
                  />
                )}
              />
            </div>
            <div className="mb-6">
              <Input
                label={`${t('theme')} ${t('name')}`}
                error={errors?.name?.message}
                placeholder={`${t('enter')} ${t('theme')} ${t('name')}`}
                {...register('themeName', {
                  required: 'Theme Name Required'
                })}
              />
            </div>

            {layoutValues.map((item, index) => (
              <Card key={index} className="mb-4 p-5">
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Label Input */}
                  <div className="col-span-1">
                    <Input
                      label={t('label')}
                      placeholder={`${t('enter')} ${t('label')}`}
                      {...register(`layoutValues.${index}.label`, {
                        required: 'Label Required'
                      })}
                      error={errors.layoutValues?.[index]?.label?.message}
                    />
                  </div>

                  {/* Type Listbox */}
                  <div className="col-span-1">
                    <Controller
                      name={`layoutValues.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Listbox
                          data={layoutThemeTypeOptions}
                          value={
                            layoutThemeTypeOptions.find((opt) => opt.value === field.value) || null
                          }
                          label={t('type')}
                          onChange={(val) => field.onChange(val.value)}
                          placeholder={`${t('select')} ${t('option')}`}
                          displayField="label"
                          error={errors.layoutValues?.[index]?.type?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Conditional Value Input / Picker */}
                  <div className="col-span-1">
                    {item.type === 2 ? (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-200">
                          {`${t('color')} ${t('value')}`}
                        </label>
                        <div className="rounded-lg border p-4 dark:border-dark-500 dark:bg-dark-700">
                          <HexColorPicker
                            color={item.value}
                            onChange={(val) => {
                              setValue(`layoutValues.${index}.value`, val, { shouldDirty: true });
                            }}
                            className="h-auto w-full"
                          />
                          <HexColorInput
                            color={item.value}
                            onChange={(val) => {
                              setValue(`layoutValues.${index}.value`, val, { shouldDirty: true });
                            }}
                            className="mt-4 w-full rounded border p-2 dark:bg-dark-900"
                          />
                          <div className="mt-2 text-center text-sm">
                            {t('current')}:{' '}
                            <span className="font-semibold" style={{ color: item.value }}>
                              {item.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Input
                        label={t('value')}
                        placeholder={`${t('enter')} ${t('value')}`}
                        {...register(`layoutValues.${index}.value`, {
                          required: 'Value Required'
                        })}
                        error={errors.layoutValues?.[index]?.value?.message}
                      />
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 mt-6 justify-center">
                    {layoutValues.length > 1 && (
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => deleteLayoutValue(index)}
                        disabled={isLoading}>
                        {t('deleteItem')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                onClick={addLayoutValue}
                disabled={isLoading}
                className="min-w-[7rem]">
                {t('add')}
              </Button>
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                className="min-w-[7rem]"
                onClick={handleReset}
                type="button"
                disabled={isLoading}>
                {t('reset')}
              </Button>
              <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isLoading}>
                {t('update')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
}
