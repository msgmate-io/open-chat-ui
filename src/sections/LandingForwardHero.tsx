import React from "react";

import { useContext } from "react";
import { CinematicLogo } from "../atoms/CinematicLogo";
import { GlobalContext } from "../context/GlobalContext";
import { Button } from "../ui/button";

export function LandingForwardHero() {

    const { logoUrl, navigate } = useContext(GlobalContext)
    return <>
        <div className="relative w-full z-40">
            <div className="absolute flex w-full p-4 font-bold text-2xl w-full">
                Open-Chat
                <div className="text-sm text-gray-500 mt-3 ml-1">by Msgmate.io (beta)</div>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center content-center h-screen">
            <CinematicLogo className={"mr-8"} size={420} />
            <div className="flex w-full text-3xl font-bold content-center justify-center items-center p-2">
                <h1 className="inline">
                    <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                        Open-Source
                    </span>
                    {" "}AI Chat Plattform for{" "}
                    <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                        decentralized AI Apps
                    </span>
                </h1>
            </div>
            <div className="flex flex-row gap-20">
                <Button variant="ghost" className="rounded-full border py-8 text-xl text-bold border-2" onClick={() => {
                    navigate("/docs")
                }}>Project Overview & Summary</Button>
                <Button variant="ghost" className="rounded-full border py-8 text-xl text-bold border-2" onClick={() => {
                    window.open("https://beta.msgmate.io")
                }}>Become Beta Tester Now</Button>
            </div>
        </div>
    </>
}