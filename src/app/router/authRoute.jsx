import ForgotPassword from "app/pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import OTPVerification from "../pages/Auth/OTPVerification";
import ResetPassword from "app/pages/Auth/ResetPassword";


export const authRoute = [
  {
    path: '/login',
    element: (
        <Login />
    )
  },
  {
    path: '/otp-verification',
    element: (
        <OTPVerification />
    )
  },
  {
    path: '/forgot-password',
    element: (
        <ForgotPassword />
    )
  },
  {
    path: '/reset-password',
    element: (
        <ResetPassword />
    )
  }
];

export default authRoute;