import AgentLogin from 'app/pages/AgentAuth/Login';
import AgentOTPVerification from 'app/pages/AgentAuth/OTPVerification';
import AgentForgotPassword from 'app/pages/AgentAuth/ForgotPassword';
import AgentResetPassword from 'app/pages/AgentAuth/ResetPassword';

export const agentAuthRoute = [
  {
    path: '/agent-auth/login',
    element: <AgentLogin />
  },
  {
    path: '/agent-auth/otp-verification',
    element: <AgentOTPVerification />
  },
  {
    path: '/agent-auth/forgot-password',
    element: <AgentForgotPassword />
  },
  {
    path: '/agent-auth/reset-password',
    element: <AgentResetPassword />
  }
];

export default agentAuthRoute;
