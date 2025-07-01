import { configureStore } from '@reduxjs/toolkit';
import callReducer from '../store/callSlice';

const store = configureStore({
  reducer: {
    call: callReducer,
  },
});

export default store;
