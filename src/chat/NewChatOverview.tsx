import React, { useContext, useState } from 'react';
import { ContactsLoader, PublicProfilesLoader } from "../loaders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { useSelector } from "react-redux";
import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { GlobalContext } from "../context";
import { cn } from '../lib/utils';
import { RootState } from "../store/store";
import { Button } from '../ui/button';
import {
    Card,
    CardContent,
} from "../ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { CollapseIndicator } from './NewChatCard';


function ContactsList() {
    const contacts = useSelector((state: RootState) => state.contacts.value)
    const { navigate } = useContext(GlobalContext);

    const onClickProfile = (profile) => {
        navigate(null, { chat: "create", userId: profile.uuid })
    }

    return <div className="flex flex-col h-full w-full content-center items-center">
        {!contacts && <div>Loading...</div>}
        {contacts && <div className="flex flex-wrap gap-2 w-full items-center content-center justify-center">{
            contacts.results?.map(
                (contact, i) => <Card onClick={() => {
                    onClickProfile(contact)
                }} className="w-60 p-4 hover:bg-base-200" key={`contact_${i}`}>{contact.first_name}</Card>)
        }</div>}
    </div>
}

function PublicProfilesList() {
    const publicProfiles = useSelector((state: RootState) => state.publicProfiles.value)
    const { navigate } = useContext(GlobalContext);

    const onClickProfile = (profile) => {
        navigate(null, { chat: "create", userId: profile.uuid })
    }

    return <div className="flex flex-col h-full w-full content-center items-center">
        {!publicProfiles && <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-[800px]"
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="lg:basis-1/3">
                        <div className="p-1">
                            <Card className="pulse bg-base-200">
                                <CardContent className="pulse flex aspect-square items-center justify-center p-6">
                                    loading
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>}
        {publicProfiles && <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-[800px]"
        >
            <CarouselContent>
                {publicProfiles.results?.map((profile, index) => (
                    <CarouselItem key={index} className="lg:basis-1/3" onClick={() => onClickProfile(profile)}>
                        <div className="p-1">
                            <Card className="hover:bg-base-200">
                                <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-2">
                                    <OnlineIndicator is_online={profile.is_online} />
                                    <span className="text-3xl font-semibold">{profile.first_name}</span>
                                    <span className="font-semibold">{profile.description_title}</span>
                                    <span className="w-full text-center">{profile.description}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        }
    </div>
}

export function PublicChatsOverview() {
    return <div className="flex flex-col h-full w-full content-center items-center bg-base-200">
        hello
    </div>
}

export function ProfileCardItem({ profile }) {
    return <Card className="w-60 p-4 hover:bg-base-200">
        <CardContent>
            <div className="flex flex-row gap-2 items-center content-center">
                <OnlineIndicator is_online={profile.is_online} />
                <div className="flex flex-col">
                    <span className="text-xl font-semibold">{profile.first_name}</span>
                    <span className="font-semibold">{profile.description_title}</span>
                    <span className="w-full text-center">{profile.description}</span>
                </div>
            </div>
        </CardContent>
    </Card>
}


const TABS = [
    {
        value: "public_profiles",
        label: "Public Profiles",
        component: PublicChatsOverview
    },
    {
        value: "contacts",
        label: "Contacts",
        component: ContactsList
    }
]

export function NewChatOverview({
    leftPannelCollapsed,
    onToggleCollapse
}) {
    const [tab, setTab] = useState("contacts");

    const onTabChange = (value) => {
        setTab(value);
    }

    return <div className="flex flex-col h-full w-full content-center items-center bg-base-200">
        <ContactsLoader />
        <PublicProfilesLoader />
        <div className='flex flex-row w-full p-2 content-center items-center justify-center'>
            {leftPannelCollapsed && <CollapseIndicator leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
            <div className='flex-grow'></div>
            <Button variant='outline' className='hover:bg-base-300 hover:text-base-content rounded-3xl' onClick={() => { }}>Account</Button>
        </div>
        <div className="flex w-full text-3xl font-bold content-center justify-center items-center p-2">
            <h1 className="inline">
                Explore{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                    Msgmate.io
                </span>,{" "}
                Bots & Users
            </h1>
        </div>
        <div className='flex w-full items-center content-center justify-center text-sm'>
            Discover custom Msgmate.io Bots or Chat with other users
        </div>
        <div className='flex w-full relative items-center content-center justify-center pt-4'>
            <Tabs value={tab} onValueChange={onTabChange} defaultValue="account" className="w-full flex flex-col relative">
                <TabsList className='bg-base-200'>
                    {TABS.map((tab, i) => <TabsTrigger key={i} value={tab.value} className={cn('bg-base-200')}>{tab.label}</TabsTrigger>)}
                </TabsList>
                {TABS.map((tab, i) => <TabsContent key={i} value={tab.value}>
                    <tab.component />
                </TabsContent>)}
            </Tabs>
        </div>
    </div>
}