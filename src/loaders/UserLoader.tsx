import { useApi } from "@msgmate-io/open-chat-typescript-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from 'swr';
import { RootState } from "../store/store";
import { fetchUser } from "../store/user";

export function useUser() {
    const dispatch = useDispatch();
    const api = useApi();
    const user = useSelector((state: RootState) => state.user.value);

    const { data, error, mutate } = useSWR('user', async () => {
        return api.userSelfRetrieve();
    });


    useEffect(() => {
        if (data) {
            dispatch(fetchUser(data));
        }
    }, [data]);

    return { user, error, mutate };
}