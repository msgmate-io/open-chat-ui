import React, { useState } from "react";

import { useContext } from "react";
import { CinematicLogo } from "../atoms/CinematicLogo";
import { Typewriter } from "../atoms/TypewriterEffect";
import { ExploreChatsIcon } from "../chat/ChatsList";
import { GlobalContext } from "../context/GlobalContext";
import { ModeToggle } from "../landing_page/mode-toggle";
import { Button } from "../ui/button";
import { LoginSection } from "./LoginSection";



const GradHeadingH1 = () => {
    return (
        <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-center">
            <span className="gradient-text">Your Text Here</span>
        </h1>
    );
};
const TEXTS = [{
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
    prompt: "\"How is it going?\"",
    completion: "Nope! I'm still here, ready to assist you whenever you need it. Since we're in an audio chat, feel free to talk about anything on your mind, and I'll do my best to help or simply engage in a conversation. What's on your mind today?"
}, {
    model: "databricks/dbrx-instruct",
    prompt: "\"How can I help you today?\"",
    completion: "I'm here to help you with anything you need. If you have any questions or need assistance, feel free to ask. I'm here to help."
}]

function DefaultFooter() {
    return <>
        <div className="flex flex-col items-center justify-center content-center w-full">
            <div>homepage</div>
        </div>
        <div className="flex flex-row items-center justify-center content-center w-full p-2">
            <div className="flex w-1/2 justify-end">
                <Button variant="ghost" className="h-5 p-1 hover:text-neutral">Therms of use</Button>
            </div>
            |
            <div className="flex w-1/2 justify-start">
                <Button variant="ghost" className="h-5 p-1">Privacy policy</Button>
            </div>
        </div>
    </>
}

function IndexTab({
    tab, setTab
}) {
    return <>
        <CinematicLogo className={"mr-8"} size={420} />
        <div className="flex flex-row items-center justify-center content-center w-full relative">
            <div className="flex w-1/2 justify-end pr-4">
                <Button variant="ghost" className="rounded-full border py-8 text-xl text-bold border-2" onClick={() => {
                    setTab("register")
                }}>Sign-up</Button>
            </div>
            <div className="flex w-1/2 justify-start pl-4">
                <Button variant="ghost" className="rounded-full border py-8 text-xl text-bold border-2" onClick={() => {
                    setTab("login")
                }}>Log-in</Button>
            </div>
        </div>
    </>
}

function LoginTab({
    tab, setTab
}) {
    return <>
        <LoginSection />
    </>
}

function RegisterTab({
    tab, setTab
}) {
    return <div>
        <div className="flex flex-col items-center content-center justify-center pb-2">
            <h1 className="text-2xl font-bold text-center">No Sign-up Yet!</h1>
            <p className="text-lg text-center">
                We are in closed beta, you can contact{" "}
                <a href="mailto:tim@msmate.io" className="text-blue-500 text-bold">
                    tim@msgmate.io
                </a>{" "}
                to get early access.
            </p>
        </div>
    </div>
}

export function LandingHero() {
    const [tab, setTab] = useState("index")

    const { logoUrl } = useContext(GlobalContext)
    return <>
        <div className="relative w-full z-40">
            <div className="absolute flex w-full p-4 font-bold text-2xl w-full">
                Open-Chat
                <div className="text-sm text-gray-500 mt-3 ml-1">by Msgmate.io (beta)</div>
            </div>
        </div>
        <div className="flex flex-row items-center justify-center content-center h-screen">
            <div className="flex flex-col flex-grow items-center justify-center content-center bg-base-200 w-2/3 h-full shadow-xl z-10 hidden lg:flex relative">
                <Typewriter
                    typingSpeed={10}
                    texts={TEXTS} />
            </div>
            <div className="flex flex-col flex-grow items-center justify-center content-center bg-base-100 w-1/3 h-full">
                <div className="flex flex-col items-end justify-end content-center w-full p-2">
                    <div className="p-2 hover:bg-base-300 rounded-xl z-40" onClick={() => {
                        setTab("index")
                    }}>
                        {tab !== "index" && <div className="p-1"><ExploreChatsIcon /></div>}
                        {tab === "index" && <ModeToggle />}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center content-center w-full flex-grow">
                    {tab === "index" && <IndexTab tab={tab} setTab={setTab} />}
                    {tab === "login" && <LoginTab tab={tab} setTab={setTab} />}
                    {tab === "register" && <RegisterTab tab={tab} setTab={setTab} />}
                </div>
                <DefaultFooter />
            </div>
        </div>
    </>
}