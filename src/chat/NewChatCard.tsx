import logo from "../assets/logo.png";
import { navigateSearch } from "../atoms/Link";
import {
    Card,
} from "../ui/card";


export function NewChatCard() {

    return <Card className="bg-base-200 hover:bg-base-300 p-0 flex drop-shadow-xl z-10" key={"chatListHeader"}>
        <div className="flex">
            <img src={logo} className="h-12" alt="logo" />
        </div>
        <div className="flex flex-grow items-center content-center justify-start pr-2" onClick={() => {
            navigateSearch({ chat: "new" })
        }}>
            <div className="p-2 flex flex-grow">New Chat</div>
            <div>✍️</div>
        </div>
    </Card>
}
