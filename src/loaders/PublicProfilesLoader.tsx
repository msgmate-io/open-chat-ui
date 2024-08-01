import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { useApi } from "../api/client2";
import { fetchPublicProfiles } from "../store/publicProfiles";
import { RootState } from "../store/store";

export function usePublicProfiles() {
    const dispatch = useDispatch();
    const api = useApi();
    const publicProfiles = useSelector((state: RootState) => state.publicProfiles.value);

    const { data, error, mutate } = useSWR('publicProfiles', async () => {
        return api.publicProfilesList({});
    });

    useEffect(() => {
        if (data) {
            dispatch(fetchPublicProfiles(data));
        }
    }, [data]);

    return { publicProfiles, error, mutate };
}
