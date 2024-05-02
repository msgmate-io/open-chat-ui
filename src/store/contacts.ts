import { PaginatedUserProfileList } from '../api/api';
import { createSlice } from '@reduxjs/toolkit';

export interface ContactsState {
    value: null | PaginatedUserProfileList;
}

const inialState: ContactsState = {
    value: null,
} satisfies ContactsState as ContactsState;

export const contactsSlice = createSlice({
    name: 'contacts',
    initialState: inialState,
    reducers: {
        fetchContacts: (state, action) => {
            state.value = action.payload;
        },
        updateContactsOnlineStatus: (state, action) => {
            const { userId, isOnline } = action.payload;
            if (state.value) {
                state.value.results.forEach(profile => {
                    if (profile.uuid === userId) {
                        profile.is_online = isOnline;
                    }
                });
            }
        }
    }
});

export const {
    fetchContacts,
    updateContactsOnlineStatus
} = contactsSlice.actions;
