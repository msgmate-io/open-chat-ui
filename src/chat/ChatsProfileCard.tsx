import { useApi } from "@msgmate-io/open-chat-typescript-client";
import React, { useContext } from 'react';
import { useDispatch } from "react-redux";
import ThemeSelector from "../atoms/ThemeSelector";
import { GlobalContext } from "../context/GlobalContext";
import { useProfile } from '../loaders/ProfileLoader';
import { AppDispatch, logoutUser } from "../store/store";
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
    const { profile } = useProfile();
    const { logoUrl } = React.useContext(GlobalContext);

    return <>
        <DropdownMenuTrigger asChild>
            <Card className="border-0 bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
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
    const { navigate } = useContext(GlobalContext);
    const dispatch: AppDispatch = useDispatch()
    const onLogout = () => {
        dispatch(logoutUser(api))
        setTimeout(() => {
            navigate("/");
        }, 100);
    }
    return <div className="shadow-xl">
        <DropdownMenu>
            <ProfileCardButton />
            <DropdownMenuContent className="bg-base-100 w-56 border-0">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    navigate('/')
                }}>Home Page</DropdownMenuItem>
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