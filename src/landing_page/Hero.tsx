import cubeLeg from "../assets/logo.png";
import React from 'react';


export const Hero = ({
    cinematicTitle = (<></>),
    subtitle = "subtitle",
    logoImage = cubeLeg,
    sectionId = "section_hero",
}) => {
    return (
        <section className="container w-full mx-0 lg:ms-12 py-24 justify-center" id={sectionId}>
            <div className="grid grid-cols-3 gap-1 place-items-center">
                {/**mobile logo */}
                <div className="flex lg:hidden col-span-3">
                    <img
                        src={logoImage}
                        className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
                        alt="About services"
                    />
                </div>
                <div className="text-center lg:text-start space-y-6 col-span-3 lg:col-span-2">
                    <main className="text-3xl w-full md:text-4xl font-bold">
                        {cinematicTitle}
                    </main>

                    <p className="text-xl text-muted-foreground mx-auto lg:mx-0">
                        {subtitle}
                    </p>
                </div>
                {/**desktop logo */}
                <div className="hidden lg:flex md:col-span-1">
                    <img
                        src={logoImage}
                        className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
                        alt="About services"
                    />
                </div>

            </div>

        </section>
    );
}