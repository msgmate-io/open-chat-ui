import { updateNewestMessage, updatePartnerOnlineStatus } from "../store/chats";
import { updateContactsOnlineStatus } from "../store/contacts";
import { insertMessage, updatePartialMessage } from "../store/messages";
import { updatePublicProfilesOnlineStatus } from "../store/publicProfiles";

function createEventHandler(dispatch, onReceiveDataMessage) {
    return {
        userWentOnline: (payload) => {
            const { userId } = payload;
            console.debug("User went online", payload);
            dispatch(updatePartnerOnlineStatus({
                userId: userId,
                isOnline: true
            }));
            dispatch(updateContactsOnlineStatus({
                userId: userId,
                isOnline: true
            }));
            dispatch(updatePublicProfilesOnlineStatus({
                userId: userId,
                isOnline: true
            }));
        },
        userWentOffline: (payload) => {
            const { userId } = payload;
            console.debug("User went offline", payload);
            dispatch(updatePartnerOnlineStatus({
                userId: userId,
                isOnline: false
            }));
            dispatch(updateContactsOnlineStatus({
                userId: userId,
                isOnline: false
            }));
            dispatch(updatePublicProfilesOnlineStatus({
                userId: userId,
                isOnline: false
            }));
        },
        newMessage: (payload) => {
            const { chat, message, senderId } = payload;
            console.debug("New message", { chat, message, senderId });
            dispatch(insertMessage({
                chatId: chat.uuid,
                message: message
            }));
            dispatch(updateNewestMessage({
                chatId: chat.uuid,
                message: message
            }));
        },
        newPartialMessage: (payload) => {
            const { chat, message, senderId } = payload;
            const hasDataMessage = message?.data_message;
            const isHidden = message?.hidden
            if (hasDataMessage)
                onReceiveDataMessage(message);

            if (!isHidden)
                dispatch(
                    updatePartialMessage(
                        {
                            chatId: chat.uuid,
                            message: message
                        }
                    )
                )
            console.debug("New partial message", { chat, message, senderId });
        },
    }
}

export const useCustomEventHandler = (dispatch, onReceiveDataMessage) => {
    return createEventHandler(dispatch, onReceiveDataMessage);
};