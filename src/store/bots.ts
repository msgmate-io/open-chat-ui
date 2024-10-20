import { PaginatedBotsControlList } from '@msgmate-io/open-chat-typescript-client';
import * as toolkitRaw from '@reduxjs/toolkit';
// @ts-ignore
const { createSlice } = toolkitRaw?.default ?? toolkitRaw;

export interface BotsState {
    value: null | PaginatedBotsControlList;
}

const initialState: BotsState = {
    value: null,
} satisfies BotsState as BotsState;

export const botsSlice = createSlice({
    name: 'bots',
    initialState: initialState,
    reducers: {
        fetchBots: (state, action) => {
            state.value = action.payload;
        },
        updateBotOnlineStatus: (state, action) => {
            const { botId, isOnline } = action.payload;
            if (state.value) {
                state.value.results.forEach(bot => {
                    if (bot.uuid === botId) {
                        bot.is_online = isOnline;
                    }
                });
            }
        }
    }
});

export const {
    fetchBots,
    updateBotOnlineStatus,
} = botsSlice.actions;