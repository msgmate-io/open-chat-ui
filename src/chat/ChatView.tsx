import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import logo from "../assets/logo.png";
import { navigateSearch } from "../atoms/Link";
import ThemeSelector from "../atoms/ThemeSelector";
import ProfileLoader from "../loaders/ProfileLoader";
import { AppDispatch, RootState, logoutUser } from "../store/store";
import {
    Card,
} from "../ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChatItem, PendingChatItem } from "./chat";

function NewChatCard() {

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

function ProfileCardButton() {
    const profile = useSelector((state: RootState) => state.profile.value)

    return <>
        <ProfileLoader />
        <DropdownMenuTrigger asChild>
            <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
                <div className="flex">
                    <img src={logo} className="h-12" alt="logo" />
                </div>
                <div className="flex flex-grow items-center content-center justify-start pr-2">
                    <div className="p-2 flex flex-grow">{profile?.first_name} {profile?.second_name}</div>
                    <div>✍️</div>
                </div>
            </Card>
        </DropdownMenuTrigger>
    </>
}

function ProfileMenu() {
    const api = useApi();
    const dispatch: AppDispatch = useDispatch()
    const onLogout = () => {
        dispatch(logoutUser(api))
    }
    return <div className="shadow-xl">
        <DropdownMenu>
            <ProfileCardButton />
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Home Page</DropdownMenuItem>
                <DropdownMenuItem>Docs</DropdownMenuItem>
                <DropdownMenuLabel><ThemeSelector /></DropdownMenuLabel>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}


export function ChatsList() {
    const chats = useSelector((state: RootState) => state.chats.value?.results)
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat)
    return <div className="flex flex-col gap-0 h-full">
        <NewChatCard />
        <div className="flex flex-col flex-grow gap-1 overflow-y-scroll py-2">{
            chats ? chats.map(chat => <ChatItem chat={chat} key={`chat_${chat.uuid}`} isSelected={chat.uuid === chatId} />) : Array.from({ length: 5 }).map((_, i) => <PendingChatItem key={`chat_${i}`} />)
        }</div>
        <ProfileMenu />
    </div>
}