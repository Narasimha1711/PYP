import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/",
    credentials: "include", // If using cookies for auth
  }),
  endpoints: (builder) => ({}),
});

export default apiSlice;
