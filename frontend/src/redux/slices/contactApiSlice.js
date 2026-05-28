import { apiSlice } from './apiSlice';

export const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendContactMessage: builder.mutation({
            query: (data) => ({
                url: '/api/contact',
                method: 'POST',
                body: data,
            }),
        }),
        getContacts: builder.query({
            query: () => ({
                url: '/api/contact',
            }),
            providesTags: ['Contact'],
            keepUnusedDataFor: 5,
        }),
        updateContactStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/api/contact/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Contact'],
        }),
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/api/contact/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Contact'],
        }),
    }),
});

export const {
    useSendContactMessageMutation,
    useGetContactsQuery,
    useUpdateContactStatusMutation,
    useDeleteContactMutation,
} = contactApiSlice;
