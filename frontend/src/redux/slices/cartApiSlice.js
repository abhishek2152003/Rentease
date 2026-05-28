import { apiSlice } from './apiSlice';

const CART_URL = '/api/cart';

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => ({
                url: CART_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        syncCart: builder.mutation({
            query: (data) => ({
                url: CART_URL,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGetCartQuery, useSyncCartMutation } = cartApiSlice;
