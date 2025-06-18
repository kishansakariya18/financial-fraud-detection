// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import UserClassService from 'services/user-class.services';
import { createUserClassSchema } from './schema';
import { Avatar } from 'components/ui';
import { Upload } from 'components/ui';
import { HiPencil } from 'react-icons/hi';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { PreviewImg } from 'components/shared/PreviewImg';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { userclassStatusToAPP } from './helper';

const EditUserClass = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userClassUID } = useParams();
  const [avatar, setAvatar] = useState(null);
  const [classname, setClassName] = useState('');
  const [classcode, setClassCode] = useState('');
  const [classID, setClassID] = useState('');

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [{ title: t('userClass'), path: '/user-class' }, { title: t('edit') }];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createUserClassSchema)
  });
  const editUserClassAPI = async (requestObject) => {
    // console.log('requestObject: ', requestObject);

    setLoading(true);
    setError(null);
    const result = await UserClassService.userClassUpdate(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchUserClassDetails = async () => {
    try {
      const result = await UserClassService.userClassDetail(userClassUID);
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
    if (userClassUID) {
      fetchUserClassDetails().then((result) => {
        if (result) {
          const mappedData = {
            className: result?.ClassName,
            classCode: result?.ClassCode,
            avatarURL: result?.AvatarURL,
            status: result.IsActive ? userclassStatusToAPP(result.IsActive) : undefined
          };
          setAvatar(result?.AvatarURL);
          setClassName(result?.ClassName);
          setClassCode(result?.ClassCode);
          setClassID(result?.UserClassID);
          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClassUID]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    navigate('/user-class');
    setResponse(null);
    fetchUserClassDetails();
  }

  const onSubmit = async (data) => {
    console.log(data);
    editUserClassAPI({
      classID: classID,
      avatarURL: avatar,
      classname: classname,
      classcode: classcode
    });
  };
  return (
    <Page title={t('edit') + ' ' + t('userClass')}>
      <div className="transition-content grid max-w-2xl grid-rows-[auto_1fr] px-[--margin-x] pb-8 2xl:max-w-5xl">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('userClass') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-4 flex flex-col space-y-1.5">
            <span className="text-base font-medium text-gray-800 dark:text-dark-100">Avatar</span>
            <Avatar
              size={20}
              src={avatar}
              imgComponent={PreviewImg}
              imgProps={{ file: avatar }}
              classNames={{
                root: 'rounded-xl ring-primary-600 ring-offset-[3px] ring-offset-white transition-all hover:ring dark:ring-primary-500 dark:ring-offset-dark-700',
                display: 'rounded-xl'
              }}
              indicator={
                <div className="absolute bottom-0 right-0 -m-1 flex items-center justify-center rounded-full bg-white dark:bg-dark-700">
                  {avatar ? (
                    <Button onClick={() => setAvatar(null)} isIcon className="size-6 rounded-full">
                      <XMarkIcon className="size-4" />
                    </Button>
                  ) : (
                    <Upload name="avatar" onChange={setAvatar} accept="image/*">
                      {({ ...props }) => (
                        <Button isIcon className="size-6 rounded-full" {...props}>
                          <HiPencil className="size-3.5" />
                        </Button>
                      )}
                    </Upload>
                  )}
                </div>
              }
            />
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('className')}
                label={t('Class Name')}
                error={errors?.className?.message}
                placeholder={t('enter') + ' ' + t('className')}
              />
              <Input
                {...register('classCode')}
                label={t('Class Code')}
                error={errors?.classCode?.message}
                placeholder={t('enter') + ' ' + t('classCode')}
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

export default EditUserClass;
