import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => "/user-info",
    }),
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    userSignup: builder.mutation({
        query: (credentials) => ({
          url: "/auth/signup",
          method: "POST",
          body: credentials,
        }),
      }),
    userLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    completeGoogleSignup: builder.mutation({
      query: (data) => ({
        url: '/auth/complete-google-signup',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useUserLoginMutation, useUserLogoutMutation, useUserSignupMutation, useCompleteGoogleSignupMutation } = userApiSlice;
