import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Card } from 'components/ui';
import { Input } from 'components/ui/Form';
import { Button } from 'components/ui/Button';
import { toast } from 'sonner';
import PasswordManagerService from 'services/password-manager.service';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { passwordManagerSchema } from '../schema';

const PasswordChangeForm = ({ title, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordManagerSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onFormSubmit = (data) => {
    onSubmit(data, reset);
  };

  const renderPasswordInput = (name, label, placeholder, showKey) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          type={showPassword[showKey] ? 'text' : 'password'}
          error={errors[name]?.message}
          placeholder={placeholder}
          suffix={
            <Button
              variant="flat"
              className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
              onClick={() => togglePassword(showKey)}
              type="button">
              {showPassword[showKey] ? (
                <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
              ) : (
                <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
              )}
            </Button>
          }
        />
      )}
    />
  );

  return (
    <Card className="border border-gray-200 p-6 dark:border-dark-500">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-50">{title}</h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
        {renderPasswordInput(
          'currentPassword',
          t('currentPassword'),
          t('currentPasswordPlaceholder'),
          'current'
        )}
        {renderPasswordInput('newPassword', t('newPassword'), t('newPasswordPlaceholder'), 'new')}
        {renderPasswordInput(
          'confirmPassword',
          t('confirmPassword'),
          t('confirmPasswordPlaceholder'),
          'confirm'
        )}
        <div className="mt-2 flex justify-end">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? t('Updating...') : t('update')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default function PasswordManager() {
  const { t } = useTranslation();
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAffiliate, setLoadingAffiliate] = useState(false);

  const handleUserPasswordChange = async (data, resetForm) => {
    setLoadingUser(true);
    try {
      const response = await PasswordManagerService.changeUserFundPassword(data);
      if (response?.status === 200 || response?.status === 201) {
        console.log(response);
        toast.success(response?.response.message || 'User fund password updated successfully');
        resetForm();
      } else {
        toast.error(response?.response.message || 'Failed to update user fund password');
      }
    } catch (error) {
      toast.error(error?.response?.message || 'An error occurred');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleAffiliatePasswordChange = async (data, resetForm) => {
    setLoadingAffiliate(true);
    try {
      const response = await PasswordManagerService.changeAffiliateFundPassword(data);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.response?.message || 'Affiliate fund password updated successfully'
        );
        resetForm();
      } else {
        toast.error(response?.response?.message || 'Failed to update affiliate fund password');
      }
    } catch (error) {
      toast.error(error?.response?.message || 'An error occurred');
    } finally {
      setLoadingAffiliate(false);
    }
  };

  return (
    <ContentWrapper pageTitle={t('passwordManager')}>
      <div className="flex items-center space-x-4 px-[--margin-x] py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {t('passwordManager')}
        </h2>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
        </div>
      </div>
      <div className="px-[--margin-x]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PasswordChangeForm
            title={t('userManageFundPassword')}
            onSubmit={handleUserPasswordChange}
            loading={loadingUser}
          />
          <PasswordChangeForm
            title={t('affiliateManageFundPassword')}
            onSubmit={handleAffiliatePasswordChange}
            loading={loadingAffiliate}
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
