import React from "react";

import { useContext } from "react";
import { CinematicLogo } from "../atoms/CinematicLogo";
import { Typewriter } from "../atoms/TypewriterEffect";
import { GlobalContext } from "../context/GlobalContext";
import { Button } from "../ui/button";

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

export function LandingHero() {

    const { logoUrl } = useContext(GlobalContext)
    return <div className="flex flex-row items-center justify-center content-center h-screen">
        <div className="flex flex-col flex-grow items-center justify-center content-center bg-base-200 w-2/3 h-full shadow-xl z-10">
            <div className="flex w-full p-4 font-bold text-2xl">
                Open-Chat
                <div className="text-sm text-gray-500 mt-3 ml-1">by Msgmate.io</div>
            </div>
            <Typewriter
                typingSpeed={10}
                texts={TEXTS} />
        </div>
        <div className="flex flex-col flex-grow items-center justify-center content-center bg-base-100 w-1/3 h-full">
            <div className="flex flex-col items-center justify-center content-center w-full flex-grow">
                <CinematicLogo className={"mr-8"} size={320} />
                <div className="flex flex-row items-center justify-center content-center w-full relative">
                    <div className="flex w-1/2 justify-end pr-4">
                        <Button variant="ghost" className="rounded-full border">Sign-up</Button>
                    </div>
                    <div className="flex w-1/2 justify-start pl-4">
                        <Button variant="ghost" className="rounded-full border">Log-in</Button>
                    </div>
                </div>
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
        </div>
    </div>
}