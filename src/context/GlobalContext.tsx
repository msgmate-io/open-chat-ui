import { createContext } from "react";
export const GlobalContext = createContext({
    logoUrl: "",
    navigate: (url, ...props) => { }
})

export const defaultGlobalContext = {
    logoUrl: "https://avatars.githubusercontent.com/u/163599389",
    navigate: (url, ...props) => { console.log("NAVIGATE TO", url) }
}