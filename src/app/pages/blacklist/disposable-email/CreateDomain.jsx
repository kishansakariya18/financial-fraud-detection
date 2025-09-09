import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomModal } from 'components/custom';
import { Page } from 'components/shared/Page';
import { Button, Circlebar, Input } from 'components/ui';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import BlacklistService from 'services/blacklist.services';
import { toast } from 'sonner';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

export function CreateDisposableEmail({ tableFetch }) {
  const [loading, setLoading] = useState(false);
  const [modelState, setModelState] = useState(false);

  const validationSchema = Yup.object().shape({
    emailDomain: Yup.string().trim().required('Email domain is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleState = (value) => {
    if (!value) {
      reset();
    }
    setModelState(value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await BlacklistService.addDisposableEmailDomain(data);
    if (result.status === 200 || result.status === 201) {
      toast.success(result.response.message);
      tableFetch(false);
      handleState(false);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <CustomModal
        show={modelState}
        title={t('add') + ' ' + t('emailDomain')}
        btnTitle={t('add') + ' ' + t('emailDomain')}
        btnClassName="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
        isShowBtn={true}
        btnColor="primary"
        onClose={() => handleState(false)}
        onOpen={() => handleState(true)}
        onOk={() => handleState(false)}>
        <Page title={t('emailDomain')}>
          <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-1">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  <Input
                    prefix={<ChevronDoubleRightIcon className="size-5" />}
                    label={t('emailDomain')}
                    error={errors?.emailDomain?.message}
                    disabled={loading}
                    placeholder={t('enter') + ' ' + t('emailDomain')}
                    {...register('emailDomain')}
                  />
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

CreateDisposableEmail.propTypes = {
  tableFetch: PropTypes.func
};
