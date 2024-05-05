import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { RootState } from "../store/store";
import { fetchUser } from "../store/user";

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