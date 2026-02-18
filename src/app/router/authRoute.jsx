import ForgotPassword from 'app/pages/Auth/ForgotPassword';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import ResetPassword from 'app/pages/Auth/ResetPassword';

export const authRoute = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  }
];

export default authRoute;
