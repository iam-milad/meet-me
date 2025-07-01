import { configureStore } from '@reduxjs/toolkit';
import callReducer from '../store/callSlice';
import dialogReducer from '../store/dialogSlice';

const store = configureStore({
  reducer: {
    call: callReducer,
    dialog: dialogReducer
  },
});

export default store;
