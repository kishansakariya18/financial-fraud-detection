import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE } from 'constants/app.constant';

const userToken = localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN)
  ? localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN)
  : null;

const userData = localStorage.getItem(LOCAL_STORAGE.USER_DATA)
  ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_DATA))
  : null;

const isMasterAdmin = localStorage.getItem(LOCAL_STORAGE.IS_MASTER_ADMIN)
  ? localStorage.getItem(LOCAL_STORAGE.IS_MASTER_ADMIN)
  : 0;

const permissions = localStorage.getItem(LOCAL_STORAGE.PERMISSIONS)
  ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERMISSIONS))
  : [];

const initialState = {
  isLoggedIn: userToken ? true : false,
  userData: userData,
  isMasterAdmin: isMasterAdmin,
  permissions: permissions
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload.adminData;
      state.isMasterAdmin = action.payload.isMasterAdmin;
      state.permissions = action.payload.permissions;
    },
    logout(state, message) {
      console.log('message: ', message);
      if (state.isLoggedIn && message.payload) {
        // toast.error(message.payload, config.TOAST_UI);
        console.log('logout toast should be add');
      }
      state.isLoggedIn = false;
      state.userData = null;
      state.permissions = [];
    },
    sendLoginOtp(state, action) {
      state.isLoggedIn = false;
      state.twoStepMode = 'login';
      state.authEmail = action.payload.authEmail;
      state.authPassword = action.payload.authPassword;
      state.authMfaEnabled = action.payload.mfaEnabled;
    },
    roleUpdate(state, action) {
      console.log('action.payload::', action.payload);

      state.permissions = action.payload.permissions;
    }
  }
});

export const AuthAction = AuthSlice.actions;
export default AuthSlice;
//   name: 'Auth',
//   initialState,
//   reducers: {
//     sendLoginOtp(state, action) {
//       state.isLoggedIn = false;
//       state.twoStepMode = 'login';
//       state.authEmail = action.payload.authEmail;
//       state.authPassword = action.payload.authPassword;
//       state.authMfaEnabled = action.payload.authMfaEnabled;
//       state.authVerifyOTP = action.payload.authVerifyOTP;
//     },
//     login(state, action) {
//       state.isLoggedIn = true;
//       state.authToken = action.payload.authData.token;
//       state.isMasterAdmin = action.payload.authData.isMasterAdmin;
//       state.authPassword = null;
//       state.authVerifyOTP = false;
//       state.twoStepMode = null;
//       state.authData = action.payload.authData
//       state.permissions = action.payload.permissions
//     },
//     sendForgotOtp(state, action) {
//       state.isLoggedIn = false;
//       state.twoStepMode = 'forgot_password';
//       state.authEmail = action.payload.authEmail;
//     },
//     validateForgotOtp(state) {
//       state.isLoggedIn = false;
//       state.twoStepMode = null;
//     },
//     logout(state) {
//       state.isLoggedIn = false;
//       state.twoStepMode = null;
//       state.authEmail = null;
//       state.authPassword = null;
//       state.authMfaEnabled = null;
//       state.authVerifyOTP = false;
//       state.authToken = null;
//       state.userData = null;
//       state.permissions = [];
//     },
//     changeNameSpace(state, action) {
//       state.nameSpace = action.payload.nameSpace
//     }
//     ,
//     changeAdminProfile(state, action) {

//       state.authData.profilePic = action.payload.profilePic
//       state.authData.firstName  = action.payload.firstName
//       state.authData.lastName  = action.payload.lastName
//       state.authData.fullName = (action.payload.firstName).trim() + ' ' + (action.payload.lastName).trim()
//       localStorage.setItem('AuthData', JSON.stringify({
//         ...JSON.parse(localStorage.getItem('AuthData')),
//         firstName: action.payload.firstName,
//         profilePic: action.payload.profilePic,
//         lastName: action.payload.lastName,
//         fullName: (action.payload.firstName).trim() + ' ' + (action.payload.lastName).trim()
//       }))
//     }
//   },
// });
