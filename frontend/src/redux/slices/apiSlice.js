import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, data, params, headers, body }) => {
      try {
        const result = await axios({
          url: baseUrl + url,
          method,
          data: data || body,
          params,
          headers,
          withCredentials: true, // For JWT cookies
        });
        return { data: result.data };
      } catch (axiosError) {
        let err = axiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://rentease-5bbp.onrender.com';
export const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

export const apiSlice = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Product', 'Order', 'User', 'Session'],
  endpoints: (builder) => ({}),
});
