import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const url = process.env.NODE_ENV === 'production' ? 'https://projectmngr-api.onrender.com' : 'http://localhost:3500'

const baseQuery = fetchBaseQuery({
    baseUrl: url,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if(token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403) {
        console.log('Sending refresh token...')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data) {
            api.dispatch(setCredentials({...refreshResult.data}))
            result = await baseQuery(args, api, extraOptions)
        } else {
            if(refreshResult.error?.status === 403) {
                refreshResult.error.data.message = "Your login expired. "
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Project', 'User', 'Activity'],
    endpoints: builder => ({})
});