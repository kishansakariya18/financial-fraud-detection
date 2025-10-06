import AgentLogin from 'app/pages/AgentAuth/Login';
import AgentOTPVerification from 'app/pages/AgentAuth/OTPVerification';
import AgentForgotPassword from 'app/pages/AgentAuth/ForgotPassword';
import AgentResetPassword from 'app/pages/AgentAuth/ResetPassword';
import { platformGuard } from 'app/router/PlatformRouteGuard';
import { PLATFORM_TYPE } from 'constants/app.constant';
import { Outlet } from 'react-router';

export const agentAuthRoute = [
  {
    loader: platformGuard([PLATFORM_TYPE.B2B]),
    element: <Outlet />,
    children: [
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
    ]
  }
];

export default agentAuthRoute;
