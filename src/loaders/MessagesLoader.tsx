import { useApi } from "@msgmate-io/open-chat-typescript-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { fetchMessages } from "../store/messages";
import { RootState } from "../store/store";

export function useMessages({
    chatId
}) {
    const dispatch = useDispatch();
    const api = useApi();
    const messages = useSelector((state: RootState) => state.messages.chatMessages?.[chatId]);

    const { data, error, mutate } = useSWR('messages', async () => {
        return api.messagesList({
            chatUuid: chatId,
            page_size: 20
        });
    });

    useEffect(() => {
        if (data) {
            dispatch(fetchMessages({ chatId, messages: data }));
        }
    }, [data]);

    useEffect(() => {
        if (chatId) {
            mutate();
        }
    }, [chatId]);

    return { messages, error, mutate };
}