import AuthLayout from 'components/sections/auth/AuthLayout';
import ForgotPasswordForm from 'components/sections/auth/ForgotPasswordForm';
import AuthService from 'services/auth.services';
import { forgotPasswordSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const { t } = useTranslation();
  return (
    <AuthLayout title="Forgot Password">
      <ForgotPasswordForm
        authService={AuthService}
        forgotPasswordSchema={forgotPasswordSchema}
        title={t('welcome_back')}
        subtitle={t('confirm_to_reset')}
        loginLink="/login"
        resetPasswordRoute="/reset-password"
        successRedirect="/"
      />
    </AuthLayout>
  );
}
