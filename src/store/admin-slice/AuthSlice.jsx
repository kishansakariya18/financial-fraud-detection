import { createSlice } from '@reduxjs/toolkit';
import { ADMIN_TYPE, LOCAL_STORAGE } from 'constants/app.constant';

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

const isAgentUser = localStorage.getItem(LOCAL_STORAGE.IS_AGENT_USER)
  ? localStorage.getItem(LOCAL_STORAGE.IS_AGENT_USER) === 'true'
  : false;

const initialState = {
  isLoggedIn: userToken ? true : false,
  userData: userData,
  isMasterAdmin: isMasterAdmin,
  permissions: permissions,
  adminType: ADMIN_TYPE.ADMIN,
  agentType: null,
  isAgentUser
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData =
        action.payload.userData || action.payload.adminData || action.payload.agentData;
      state.isMasterAdmin = action.payload.isMasterAdmin;
      state.permissions = action.payload.permissions;
      state.adminType = action.payload.adminType || null;
      state.agentType = action.payload.agentType || null;
      state.isAgentUser = action.payload.isAgentUser || false;
    },
    logout(state, message) {
      console.log('message: ', message);
      if (state.isLoggedIn && message.payload) {
        // toast.error(message.payload, config.TOAST_UI);
        console.log('logout toast should be add');
      }
      state.isLoggedIn = false;
      state.userData = null;
      state.agentType = null;
      state.isAgentUser = false;
      state.permissions = [];
    },
    roleUpdate(state, action) {
      console.log('action.payload::', action.payload);

      state.permissions = action.payload.permissions;
    },
    updateUserData(state, action) {
      state.userData = action.payload;
    }
  }
});

export const AuthAction = AuthSlice.actions;
export default AuthSlice;
