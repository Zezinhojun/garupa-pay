import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transaction.slice.ts';
import accountReducer from './slices/account.slice.ts';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        transaction: transactionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;