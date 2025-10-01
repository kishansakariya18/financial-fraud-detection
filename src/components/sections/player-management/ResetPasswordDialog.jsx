import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CustomModal } from 'components/custom/CustomModal';
import { Button, Input } from 'components/ui';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import PlayerService from 'services/player.services';

const ResetPasswordDialog = ({ isOpen, onClose, playerData, onSuccess }) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    password: yup
      .string()
      .required(t('password_required'))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        t('password_validation_message')
      ),
    confirmPassword: yup
      .string()
      .required(t('confirm_password_required'))
      .oneOf([yup.ref('password')], t('passwords_must_match'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values) => {
    if (!playerData?.userUID) {
      toast.error('Player data is missing');
      return;
    }
    await PlayerService.resetPasswordAgentPlayer(playerData.userUID, values.password)
      .then((res) => {
        toast.success(res.response.message);
        reset();
        onSuccess?.();
        onClose();
      })
      .catch((err) => {
        toast.error(err.response.message);
      });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal show={isOpen} onClose={handleClose} title={t('reset_password')} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* New Password Field */}
          <Input
            {...register('password')}
            type="password"
            prefix={<LockClosedIcon className="size-5" />}
            label={t('new_password')}
            error={errors?.password?.message}
            placeholder={t('enter_new_password')}
          />

          {/* Confirm Password Field */}
          <Input
            {...register('confirmPassword')}
            type="password"
            prefix={<LockClosedIcon className="size-5" />}
            label={t('confirm_password')}
            error={errors?.confirmPassword?.message}
            placeholder={t('confirm_new_password')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-gray-600">
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button type="submit" color="primary" loading={isSubmitting}>
            {t('reset_password')}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ResetPasswordDialog;
