import AuthLayout from 'components/sections/auth/AuthLayout';
import ForgotPasswordForm from 'components/sections/auth/ForgotPasswordForm';
import AgentAuthService from 'services/b2b-agent/agent-auth.services';
import { forgotPasswordSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function AgentForgotPassword() {
  const { t } = useTranslation();
  return (
    <AuthLayout title="Agent Forgot Password">
      <ForgotPasswordForm
        authService={AgentAuthService}
        forgotPasswordSchema={forgotPasswordSchema}
        title={t('welcome_back')}
        subtitle={t('confirm_to_reset')}
        loginLink="/agent-auth/login"
        resetPasswordRoute="/agent-auth/reset-password"
        successRedirect="/agent-dashboard"
      />
    </AuthLayout>
  );
}
