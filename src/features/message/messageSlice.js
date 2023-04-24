import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const messageSlice = createSlice({
    name: 'messages',
    initialState: [],
    reducers: {
        setMessage: (state, action) => {
            const messages = [...state]
            const id = uuidv4()
            messages.push({...action.payload, id})
            return state = messages
        },
        clearMessage: (state, action) => {
            const filteredMessages = [...state].filter(message => message.id !== action.payload)
            return state = filteredMessages
        }
    }
})

export const { setMessage, clearMessage, getMessages } = messageSlice.actions

export default messageSlice.reducer