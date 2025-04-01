import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './admin-slice/AuthSlice';

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer
  }
});

export default store;
