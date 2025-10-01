import AuthLayout from 'components/sections/auth/AuthLayout';
import ResetPasswordForm from 'components/sections/auth/ResetPasswordForm';
import AuthService from 'services/auth.services';
import { resetPasswordSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const { t } = useTranslation();

  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm
        authService={AuthService}
        title={t('welcome_back')}
        subtitle={t('reset_to_continue')}
        resetPasswordSchema={resetPasswordSchema}
        loginRoute="/login"
        successRedirect="/"
      />
    </AuthLayout>
  );
}
