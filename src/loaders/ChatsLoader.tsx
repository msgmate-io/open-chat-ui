import { useApi } from "@msgmate-io/open-chat-typescript-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { fetchChats, getChatByChatId, insertChat } from "../store/chats";
import { RootState } from "../store/store";

export function useChat({
    chatId
}) {
    const dispatch = useDispatch();
    const api = useApi();
    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId));

    const { data, error, mutate } = useSWR('chat', async () => {
        return api.chatsRetrieve(chatId);
    });

    useEffect(() => {
        if (data) {
            console.log("INSERTING Chat", data)
            dispatch(insertChat({ chat: data }));
        }
    }, [data]);

    useEffect(() => {
        if (chatId && !chat) {
            console.log("Mutating Chat", chatId)
            mutate();
        }
    }, [chatId]);

    return { chat, error, mutate };

}

export function useChats() {
    const dispatch = useDispatch();
    const api = useApi();
    const chats = useSelector((state: RootState) => state.chats.value);

    const { data, error, mutate } = useSWR('chats', async () => {
        return api.chatsList({
            page_size: 20
        })
    });

    useEffect(() => {
        console.log("FChats", data)
        if (data) {
            dispatch(fetchChats(data));
        }
    }, [data]);

    console.log("FChats passed", chats, data)

    return { chats, error, mutate };
}
