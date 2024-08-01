import { createContext } from "react";
export const GlobalContext = createContext({
    logoUrl: "",
    hostUrl: "",
    setHostUrl: (url) => { },
    navigate: (url, ...props) => { }
})

export const defaultGlobalContext = {
    logoUrl: "https://avatars.githubusercontent.com/u/163599389",
    hostUrl: "http://localhost",
    navigate: (url, ...props) => { console.log("NAVIGATE TO", url) },
    setHostUrl: (url) => { }
}