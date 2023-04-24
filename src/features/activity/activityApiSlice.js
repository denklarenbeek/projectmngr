import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { format } from "date-fns";

const activityAdapter = createEntityAdapter({
    //sortComparer: Use for custom sorting
});

const initialState = activityAdapter.getInitialState()

export const activityApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getActivity: builder.query({
            query: () => '/activity',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedActivity = responseData.map(activity => {
                    activity.start_date = format(new Date(activity.start_date), 'yyyy-MM-dd')
                    activity.id = activity._id
                    return activity
                });
                return activityAdapter.setAll(initialState, loadedActivity)
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        { type: 'Activity', id: 'LIST' },
                        ...result.ids.map(id => ({type: 'Activity', id}))
                    ]
                } else return [{ type: 'Activity', id: 'LIST' }]
            }
        }),
        getAllActivityByProject: builder.query({
            query: ({id}) => `/activity/${id}`, 
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedActivity = responseData.map(activity => {
                    activity.id = activity._id
                    return activity
                });
                return activityAdapter.setAll(initialState, loadedActivity)
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        { type: 'Activity', id: 'LIST' },
                        ...result.ids.map(id => ({type: 'Activity', id}))
                    ]
                } else return [{ type: 'Activity', id: 'LIST' }]
            }
        }),
        addNewActivity: builder.mutation({
            query: initialActivityData => ({
                url: '/activity',
                method: 'POST',
                body: {
                    ...initialActivityData
                }
            }),
            invalidatesTags: [
                { type: 'Activity', id: 'LIST' }
            ]
        }),
        updateActivity: builder.mutation({
            query: initialActivityData => ({
                url: '/activity',
                method: 'PATCH',
                body: {
                    ...initialActivityData
                },
            }),
            invalidatesTags: [
                { type: 'Activity', id: 'LIST' }
            ]
        }),
        deleteActivity: builder.mutation({
            query: ({ id }) => ({
                url: '/activity',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Activity', id: arg.id }
            ]
        })
    }),
})

export const {
    useGetActivityQuery,
    useGetAllActivityByProjectQuery,
    useAddNewActivityMutation,
    useUpdateActivityMutation,
    useDeleteActivityMutation
} = activityApiSlice;

//returns the query result object
export const selectActivityResult = activityApiSlice.endpoints.getActivity.select();
export const selectActivityByProjectResult = activityApiSlice.endpoints.getAllActivityByProject.select();

//creates memoized selector
const selectActivityData = createSelector(
    selectActivityResult,
    activityResult => activityResult.data // Normalized state object with ids & entities
)

const selectActivityByProject  = createSelector(
    selectActivityByProjectResult,
    activityByProjectResult => activityByProjectResult.data
)

//getSelectors creates these selectors and we rename them with aliases using destructering
export const {
    selectAll: selectAllActivity,
    selectById: selectActivityById,
    selectIds: selectActivityIds
} = activityAdapter.getSelectors(state => selectActivityData(state) ?? initialState);

export const {selectById: selectAllActivityByProject} = activityAdapter.getSelectors(state => selectActivityByProject(state) ?? initialState);