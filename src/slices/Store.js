import { configureStore } from '@reduxjs/toolkit';
import jwtReducer from './JwtSlice';
import userReducer from './UserSlice';

export default configureStore({
  reducer: {
    jwt: jwtReducer,
    user: userReducer,
  },
});