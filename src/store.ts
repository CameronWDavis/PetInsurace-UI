import {configureStore} from "@reduxjs/toolkit";
import {petQuoteApi} from "./features/petQuoteApi.ts";
import {petQuoteSlice} from "./features/petQuoteSlice.ts";

export const store = configureStore({
    reducer: {
        petQuote: petQuoteSlice.reducer,
        [petQuoteApi.reducerPath]: petQuoteApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(petQuoteApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;