// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Circlebar, Input, Upload } from 'components/ui';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { editGameSchema } from './schema';
import GameService from 'services/game.services';
import { CheckboxGroup } from 'components/shared/form/CheckboxGroup';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import apiConfig from 'configs/api.config';

const EditGame = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [gameImage, setGameImage] = useState('');
  const uploadRef = useRef();
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.log('preview: ', preview);

  const { gameUID } = useParams();

  const breadcrumbItem = [{ title: t('game'), path: '/casino/games/list' }, { title: t('edit') }];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    resolver: yupResolver(editGameSchema)
  });

  const fetchGameDetails = async () => {
    const result = await GameService.getGameDetails(gameUID);

    if (result.status === 200) {
      const apiData = result.response.data;
      const mappedData = {
        gameName: apiData.Name,
        minBetAmount: apiData?.MinBetAmount || 0,
        maxBetAmount: apiData?.MaxBetAmount || 0,
        categoryIds: Array.isArray(apiData.Categories)
          ? apiData.Categories.map(Number)
          : apiData.Categories
            ? [Number(apiData.Categories)]
            : [],
        image: apiData?.Image
      };
      setGameImage(apiData.Image);
      reset(mappedData);
      return apiData;
    } else {
      setError(result.error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await GameService.getCategoryListForEditGame();

      if (result.status === 200) {
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
    } catch (error) {
      console.log('category list error: ', error);
    }
  };

  useEffect(() => {
    if (gameUID) {
      fetchGameDetails().then((result) => {
        if (result) {
          const mappedData = {
            gameName: result.Name,
            minBetAmount: result?.MinBetAmount || 0,
            maxBetAmount: result?.MaxBetAmount || 0,
            categoryIds: Array.isArray(result.Categories)
              ? result.Categories.map(Number)
              : result.Categories
                ? [Number(result.Categories)]
                : [],
            image: result?.Image
          };
          setGameImage(result.Image);
          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameUID]);

  const editAffiliateAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const categoryToSend = Array.isArray(requestObject.categoryIds)
      ? requestObject.categoryIds
      : [];
    const result = await GameService.editGame(
      gameUID,
      { ...requestObject, categoryId: categoryToSend },
      file
    );
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
      navigate('/casino/games/list');
    }, 0);

    setResponse(null);
  }

  useEffect(() => {
    fetchCategories();
  }, [gameUID]);

  const onSubmit = async (data) => {
    // Convert string values to numbers before submission
    const formData = {
      ...data,
      minBetAmount: Number(data.minBetAmount),
      maxBetAmount: Number(data.maxBetAmount),
      name: data.gameName,
      gameUID
    };
    await editAffiliateAPI(formData);
  };
  return (
    <Page title={t('edit') + ' ' + t('game')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('game') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                {...register('gameName')}
                label={t('game') + ' ' + t('name')}
                error={errors?.gameName?.message}
                placeholder={t('enter') + ' ' + t('game') + ' ' + t('name')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('minBetAmount')}
                label={t('minBetAmount')}
                error={errors?.minBetAmount?.message}
                placeholder={t('enter') + ' ' + t('minBetAmount')}
                type="number"
                step="any"
                min="0"
              />
              <Input
                {...register('maxBetAmount')}
                label={t('maxBetAmount')}
                error={errors?.maxBetAmount?.message}
                placeholder={t('enter') + ' ' + t('maxBetAmount')}
                type="number"
                step="any"
                min="0"
              />
            </div>
            <Controller
              render={({ field }) => (
                <CheckboxGroup
                  data={categoryOptions}
                  value={field.value || []}
                  onChange={field.onChange}
                  name={field.name}
                  label={t('select') + ' ' + t('category')}
                  error={errors?.categoryIds?.message}
                  displayField="label"
                />
              )}
              control={control}
              name="categoryIds"
            />
            <div className="ml-4 mt-5 w-40 space-y-4">
              <div className="grid gap-4 sm:grid-cols-1">
                {(preview || gameImage) && (
                  <RenderImage
                    preview={preview}
                    value={`${apiConfig.baseURL.S3_URL}/game/${gameImage}`}
                    id={'gameImage'}
                    label="Image :"
                  />
                )}
                <Upload onChange={setFile} ref={uploadRef} setPreview={setPreview} accept={'.png'}>
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
                  }}>
                  {t('reset')}
                </Button>
              </div>
              {file && (
                <div>
                  File name : <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            {/* <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse"> */}
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              <span className="inline-flex items-center gap-2">
                {loading && <Circlebar size={4} strokeWidth={8} color="primary" isIndeterminate />}
                <span>{t('edit')}</span>
              </span>
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditGame;
