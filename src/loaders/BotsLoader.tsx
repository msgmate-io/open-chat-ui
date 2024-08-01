import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { fetchBots } from "../store/bots";
import { RootState } from "../store/store";

export function BotsLoader() {
    const api = useApi();
    const dispatch = useDispatch();
    const bots = useSelector((state: RootState) => state.bots.value);
    useEffect(() => {
        if (!bots) {
            api.botsListList({}).then((bots) => {
                fetchBots(bots);
            });
        }
    }, []);
    return null
}