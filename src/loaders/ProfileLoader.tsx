import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { useApi } from "../api/client2";
import { fetchProfile } from "../store/profile";
import { RootState } from "../store/store";

export function useProfile() {
    const dispatch = useDispatch();
    const api = useApi();
    const profile = useSelector((state: RootState) => state.profile.value);

    const { data, error, mutate } = useSWR('profile', async () => {
        return api.profileSelfRetrieve();
    });

    useEffect(() => {
        if (data) {
            dispatch(fetchProfile(data));
        }
    }, [data]);

    return { profile, error, mutate };
}