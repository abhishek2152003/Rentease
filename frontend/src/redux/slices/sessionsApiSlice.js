import { apiSlice } from './apiSlice';

const SESSIONS_URL = '/api/sessions';

export const sessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => ({
                url: SESSIONS_URL,
            }),
            providesTags: ['Session'],
            keepUnusedDataFor: 5,
        }),
        deleteSession: builder.mutation({
            query: (sessionId) => ({
                url: `${SESSIONS_URL}/${sessionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),
    }),
});

export const { useGetSessionsQuery, useDeleteSessionMutation } = sessionsApiSlice;
