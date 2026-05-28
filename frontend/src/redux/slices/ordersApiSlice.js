import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: order,
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `/api/orders/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: '/api/orders/myorders',
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: '/api/orders',
            }),
            keepUnusedDataFor: 5,
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/api/orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
        }),
        createRazorpayOrder: builder.mutation({
            query: (data) => ({
                url: '/api/payment/create-order',
                method: 'POST',
                body: data,
            }),
        }),
        verifyRazorpayPayment: builder.mutation({
            query: (data) => ({
                url: '/api/payment/verify',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation,
} = ordersApiSlice;
