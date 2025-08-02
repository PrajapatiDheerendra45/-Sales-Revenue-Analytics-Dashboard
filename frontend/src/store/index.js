import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './slices/salesSlice';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
  reducer: {
    sales: salesReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
}); 