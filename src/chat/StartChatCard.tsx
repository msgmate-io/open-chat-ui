import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { MobileBackButton } from "../atoms/MobileBackButton";
import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { GlobalContext } from "../context/GlobalContext";
import { cn } from '../lib/utils';
import { insertChat } from "../store/chats";
import { insertMessage } from "../store/messages";
import { RootState } from "../store/store";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { HalBotSelector } from './HalBotSelector';
import { MessageInput } from './MessageInput';
import { CollapseIndicator } from './NewChatCard';

export function PassKeyRequiredIndicator({
    is_required
}) {
    return <Badge variant="outline" className={`ml-1 border-${is_required ? "error" : "success"} text-accent h-4`}>{is_required ? "requires passkey" : "no passkey required"}</Badge>
}

function UserChatCard({
    userId,
    isLoading,
    profile,
    onChangePassword
}) {
    return <>
        <div className="w-full flex items-center content-center justify-left">
            <MobileBackButton />
        </div>
        <main className="flex flex-col w-full text-3xl font-bold content-center justify-center items-center p-6">
            <h1 className="inline">
                Start Chat With{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                    {userId}
                </span>{" "}
            </h1>
        </main>
        <OnlineIndicator is_online={profile?.is_online} />
        {isLoading && <div>Loading...</div>}
        <h2 className="text-xl font-bold py-2">
            {profile?.first_name} {profile?.second_name}
        </h2>
        <h2 className="text-xl font-bold py-2">
            {profile?.description_title}
        </h2>
        <p className="text-lg">
            {profile?.description}
        </p>
        <PassKeyRequiredIndicator is_required={profile?.reqires_contact_password} />
        <Input defaultValue={""} onChange={onChangePassword} placeholder={profile?.reqires_contact_password ? "Enter Password" : "No password required"} disabled={!profile?.reqires_contact_password} className="max-w-80" />
    </>
}

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

export const LoadingSpinner = ({
    size = 24,
    className,
    ...props
}: ISVGProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};

function NewBotChatCard() {
    const { logoUrl } = useContext(GlobalContext);
    return <>
        <div className='flex flex-col relative w-full h-full content-center items-center justify-center'>
            <img
                src={logoUrl}
                className="w-[100px] md:w-[200px] lg:w-[300px] object-contain"
                alt="About services"
            />
            <div className="flex content-center items-center justify-center w-full">
                hello
            </div>
        </div>
    </>
}

export function StartChatCard({
    userId,
    leftPannelCollapsed,
    onToggleCollapse
}) {
    const api = useApi()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const revealSecret = useSelector((state: RootState) => state.pageProps.search?.reveal)
    const key = useSelector((state: RootState) => state.pageProps.search?.key)
    const { navigate } = useContext(GlobalContext);


    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setIsLoading(true)
        api.profileRetrieve({
            userUuid: userId,
            reveal_secret: revealSecret
        }).then((res) => {
            console.log("PROFILE", res)
            setProfile(res)
            setIsLoading(false)
        }).catch((err) => {
            toast.error(`Failed to fetch profile: ${JSON.stringify(err)}`)
        });
    }, []);

    const [password, setPassword] = useState("")
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onCreateChat = (text) => {
        api.profileCreateChatCreate({
            userUuid: userId,
            contact_secret: password,
            reveal_secret: revealSecret
        }, { text }).then((res) => {
            dispatch(insertChat({
                chat: res.chat,
            }))
            dispatch(insertMessage({
                chatId: res.chat.uuid,
                message: res.message
            }))

            setTimeout(() => {
                navigate(null, { chat: res.chat.uuid })
            }, 50)
        }).catch((err) => {
            toast.error(`Failed to create chat: ${JSON.stringify(err)}`)
        })
    }

    return <>
        <div className="flex flex-col h-full w-full content-center items-center">
            <div className="absolute left-0 p-2 flex items-center content-center justify-left">
                {leftPannelCollapsed && <>
                    <CollapseIndicator leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />
                    <HalBotSelector />
                </>}
                {!leftPannelCollapsed && <>
                    <HalBotSelector />
                </>}
            </div>
            <div className="flex flex-col h-full w-full lg:max-w-[900px] relativ">
                <div className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll justify-center">
                    {isLoading && <LoadingSpinner size={48} className="text-content" />}
                    {!isLoading && <>
                        {!profile?.is_bot && <UserChatCard onChangePassword={onChangePassword} userId={userId} isLoading={isLoading} profile={profile} />}
                        {profile?.is_bot && <NewBotChatCard />}
                    </>}
                </div>
                <MessageInput ref={inputRef} />
            </div>
        </div>
    </>
}

