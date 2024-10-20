import { useApi } from "@msgmate-io/open-chat-typescript-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { fetchContacts } from "../store/contacts";
import { RootState } from "../store/store";

export function useContacts() {
    const dispatch = useDispatch();
    const api = useApi();
    const contacts = useSelector((state: RootState) => state.contacts.value);

    const { data, error, mutate } = useSWR('contacts', async () => {
        return api.chatsContactsList({
            page_size: 20
        });
    });

    useEffect(() => {
        if (data) {
            dispatch(fetchContacts(data));
        }
    }, [data]);

    return { contacts, error, mutate };
}