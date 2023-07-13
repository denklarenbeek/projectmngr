import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import {selectCurrentToken} from '../auth/authSlice';
import axios from 'axios'

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({type: 'User', id}))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        getUserByToken: builder.query({
            query: (token) => `/users/token/${token}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        activateUser: builder.mutation({
            query: userData => ({
                url: '/users/activate',
                method: 'POST',
                body: {
                    ...userData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        inviteNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users/invite',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        updateUserProfile: builder.mutation({
            query: ({data}) => ({
                url: '/users',
                method: 'PATCH',
                credentials: 'include',
                body: data
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        // updateUserProfile: builder.mutation({
        //         queryFn: async ({data}) => {
        //             try {
        //                 const token =  selectCurrentToken();
        //                 console.log(token);
        //                 const result = await axios.patch('http://localhost:3500/users', data, {    headers: {authorization: `Bearer ${token}`}} ) // Used Axios for the content-type: multipart/form-data header
        //                 return result
        //             } catch (error) {
        //                 console.log(error)
        //             }
        //         }
        // }),
        changeUserRole: builder.mutation({
            query: initialUserData => ({
                url: '/users/role',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        deleteUser: builder.mutation({
            query: id => ({
                url: '/users',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        })
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByTokenQuery,
    useActivateUserMutation,
    useInviteNewUserMutation,
    useUpdateUserProfileMutation,
    useChangeUserRoleMutation,
    useDeleteUserMutation,
} = usersApiSlice;

//returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();
export const selectUserByToken = usersApiSlice.endpoints.getUserByToken.select()

//creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // Normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructering
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);
