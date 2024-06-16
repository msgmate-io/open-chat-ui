import React, { useContext, useState } from 'react';
import { ContactsLoader, PublicProfilesLoader } from "../loaders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { useSelector } from "react-redux";
import { GlobalContext } from "../context";
import { cn } from '../lib/utils';
import { RootState } from "../store/store";
import { Button } from '../ui/button';
import {
    Card
} from "../ui/card";
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

export function PublicChatsOverview() {

    const publicProfiles = useSelector((state: RootState) => state.publicProfiles.value)
    const { navigate } = useContext(GlobalContext);

    const onClickProfile = (profile) => {
        navigate(null, { chat: "create", userId: profile.uuid })
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full content-center items-center bg-base-200">
            {!publicProfiles && <div>Loading...</div>}
            {publicProfiles && publicProfiles.results?.map(
                (profile, i) => <PublicProfilesItem key={`profile_${i}`} profile={profile} onClick={() => {
                    onClickProfile(profile)
                }} />)}
        </div>
    );
}

export function PublicProfilesItem({ profile, onClick }) {
    const { logoUrl } = useContext(GlobalContext);

    return <Card className="w-60 p-4 hover:bg-base-200" onClick={onClick}>
        <div className="flex flex-col items-center content-center justify-center">
            {profile?.is_bot && <img src={logoUrl} className="h-20 w-20 rounded-full" alt="avatar" />}
            <div className="text-lg font-bold">{profile.first_name}</div>
            <div className="text-sm">{profile.description}</div>
        </div>
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