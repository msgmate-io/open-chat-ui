import { createContext } from "react";
import { ROOT_URL } from "../constants";
export const GlobalContext = createContext({
    logoUrl: "",
    hostUrl: "",
    setHostUrl: (url) => { },
    navigate: (url, ...props) => { }
})

export const defaultGlobalContext = {
    logoUrl: "https://avatars.githubusercontent.com/u/163599389",
    hostUrl: ROOT_URL, //"http://localhost",
    navigate: (url, ...props) => { console.log("NAVIGATE TO", url) },
    setHostUrl: (url) => { }
}