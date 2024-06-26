import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../api/client2";
import ThemeSelector from "../atoms/ThemeSelector";
import { GlobalContext } from "../context/GlobalContext";
import { ProfileLoader } from "../loaders";
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

function ProfileCardButton() {
    const profile = useSelector((state: RootState) => state.profile.value)
    const { logoUrl } = React.useContext(GlobalContext);

    return <>
        <ProfileLoader />
        <DropdownMenuTrigger asChild>
            <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
                <div className="flex">
                    <img src={logoUrl} className="h-12" alt="logo" />
                </div>
                <div className="flex flex-grow items-center content-center justify-start pr-2">
                    <div className="p-2 flex flex-grow">{profile?.first_name} {profile?.second_name}</div>
                    <div>✍️</div>
                </div>
            </Card>
        </DropdownMenuTrigger>
    </>
}

export function ProfileCard() {
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