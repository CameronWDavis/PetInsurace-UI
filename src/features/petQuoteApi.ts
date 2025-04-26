import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {PetQuoteFields, PetQuoteResponse} from "../types.ts";

const query: (formData: PetQuoteFields) => {
  url: string;
  method: string;
  body: PetQuoteFields;
} = (formData) => ({
  url: "quotes",
  method: "POST",
  body: formData,
});

const transformResponse = (response: PetQuoteResponse): Record<string, number>  => {
  console.warn("Transforming response:", response)
    const quotes: Record<string, number> = {};
  for (const { name, quote } of response.quotes) {
    quotes[name] = Math.round(quote * 100) / 100;
  }
  return quotes;
};

// Define the API slice
export const petQuoteApi = createApi({
    reducerPath: "petQuoteApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5173/api"}),
    endpoints: (builder) => ({
        getQuote: builder.query<Record<string, number>, PetQuoteFields>({
            query,
            transformResponse
        }),
        getPreview: builder.query<Record<string, number>, PetQuoteFields>({
            query,
            transformResponse
        }),
    }),
});

// Export hooks for usage in components
export const {useLazyGetQuoteQuery, useLazyGetPreviewQuery} = petQuoteApi;
