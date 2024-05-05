export default ContactsLoader;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import { fetchContacts } from "../store/contacts";
import { RootState } from "../store/store";

function ContactsLoader() {
    const api = useApi();
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.contacts.value);
    useEffect(() => {
        if (!contacts) {
            api.chatsContactsList({
                page_size: 20
            }).then((contacts) => {
                dispatch(fetchContacts(contacts));
            })
        }
    }, []);
    return null
}