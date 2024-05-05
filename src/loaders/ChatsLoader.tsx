import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { fetchChats } from "../store/chats";
import { RootState } from "../store/store";

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