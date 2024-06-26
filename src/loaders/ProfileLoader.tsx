import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { fetchProfile } from "../store/profile";
import { RootState } from "../store/store";

export function ProfileLoader() {
    const api = useApi();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile.value);
    useEffect(() => {
        if (!profile) {
            api.profileSelfRetrieve().then((profile) => {
                dispatch(fetchProfile(profile));
            })
        }
    }, []);
    return null
}