import AuthLayout from 'components/sections/auth/AuthLayout';
import ResetPasswordForm from 'components/sections/auth/ResetPasswordForm';
import AgentAuthService from 'services/b2b-agent/agent-auth.services';
import { resetPasswordSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function AgentResetPassword() {
  const { t } = useTranslation();

  return (
    <AuthLayout title="Agent Reset Password">
      <ResetPasswordForm
        authService={AgentAuthService}
        title={t('welcome_back')}
        subtitle={t('reset_to_continue')}
        resetPasswordSchema={resetPasswordSchema}
        loginRoute="/agent-auth/login"
        successRedirect="/agent-dashboard"
      />
    </AuthLayout>
  );
}
