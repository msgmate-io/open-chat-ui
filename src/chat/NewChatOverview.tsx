import ContactsLoader from "../loaders/ContactsLoader";
import PublicProfilesLoader from "../loaders/PublicProfilesLoader";

import { useSelector } from "react-redux";
import { navigateSearch } from "../atoms/Link";
import { MobileBackButton } from "../atoms/MobileBackButton";
import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { RootState } from "../store/store";
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


function ContactsList() {
    const contacts = useSelector((state: RootState) => state.contacts.value)

    const onClickProfile = (profile) => {
        navigateSearch({ chat: "create", userId: profile.uuid })
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

    const onClickProfile = (profile) => {
        navigateSearch({ chat: "create", userId: profile.uuid })
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



export function NewChatOverview() {
    return <div className="flex flex-col h-full w-full content-center items-center">
        <ContactsLoader />
        <PublicProfilesLoader />
        <div className="w-full flex items-center content-center justify-left">
            <MobileBackButton />
        </div>
        <main className="flex w-full text-3xl md:text-4xl lg:w-8/12 font-bold content-center justify-center items-center p-6">
            <h1 className="inline">
                Start a new{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                    (AI-)Chat ?
                </span>{" "}
            </h1>
        </main>
        <h1 className="text-2xl font-bold py-2">Public Profiles</h1>
        <PublicProfilesList />
        <h1 className="text-2xl font-bold py-2">Past Contacts</h1>
        <ContactsList />
    </div>
}