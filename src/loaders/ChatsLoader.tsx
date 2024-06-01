import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { fetchChats, getChatByChatId, insertChat } from "../store/chats";
import { RootState } from "../store/store";

export function ChatLoader({
    chatId
}) {
    const api = useApi();
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId));

    useEffect(() => {
        console.log("CHAT LOADER", chatId, chat)
        if (!chat) {
            api.chatsRetrieve(chatId).then((chat) => {
                dispatch(insertChat(chat));
                console.log("CHAT LOADER", chatId, chat)
            })
        }
    }, []);

    return null
}

export function ChatsLoader() {
    const api = useApi();
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.chats.value);
    useEffect(() => {
        if (!chats) {
            api.chatsList({
                page_size: 20
            }).then((chats) => {
                dispatch(fetchChats(chats));
            })
        }
    }, []);
    return null
}