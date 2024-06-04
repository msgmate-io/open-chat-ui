
import * as toolkitRaw from '@reduxjs/toolkit';
import { UserProfile } from '../api/api';
// @ts-ignore
const { createSlice } = toolkitRaw.default ?? toolkitRaw;

export interface ProfileState {
    value: null | UserProfile;
}
const initialProfileState: ProfileState = {
    value: null,
} satisfies ProfileState as ProfileState;

export const profileSlice = createSlice({
    name: 'profile',
    initialState: initialProfileState,
    reducers: {
        fetchProfile: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { fetchProfile } = profileSlice.actions;