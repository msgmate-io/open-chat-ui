import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from 'swr';
import { useApi } from "../api/client2";
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

// TODO: depricated
export function UserLoader() {
    const api = useApi();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.value);
    useEffect(() => {
        if (!user) {
            api.userSelfRetrieve().then((user) => {
                dispatch(fetchUser(user));
            })
        }
    }, []);
    return null
}