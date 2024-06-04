import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from 'react';
import { Element } from 'react-scroll';
import { Link } from "../atoms/Link";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

export const BetaBanner = ({
    id = "beta",
    title = "Beta",
    subtitle = "",
    githubLink = "",
    becomeTesterBtnText = "Become a Beta Tester",
}) => {


    return (

        <section
            id={`section_${id}`}
            className="container py-6 md:py-12 space-y-8"
        >
            <Element name={id} className="element">
                <Card className="hover:backdrop-blur-sm hover:dark:text-light dark:hover:bg-orange-900/50 hover:bg-orange-400/50">
                    <CardHeader>
                        <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
                            We are in {" "}
                            <span className="inline bg-gradient-to-r from-[#D247BF]  to-[#03a3d7] text-transparent bg-clip-text">
                                {title}
                            </span>
                        </h2>
                    </CardHeader>
                    <CardContent className="grid grid-cols-12">
                        <p className="col-span-12 md:col-span-8">
                            {subtitle}
                        </p>
                        <Separator orientation="vertical" className="hidden md:flex col-span-0 ms-5 bg-gray-400" />
                        <div className="grid grid-cols-1 col-span-12 md:col-span-3 justify-items-center md:me-12 mt-12 md:my-0">
                            <Link
                                href={githubLink}
                                target="_blank"
                                className={`col-span-4 sm:col-span-2 border ${buttonVariants({
                                    variant: "ghost",
                                })}`}
                            >
                                <GitHubLogoIcon className="mr-2 w-5 h-5" />
                                Github
                            </Link>
                            <Separator className="my-1 col-span-6 md:col-span-12 bg-gray-400" />
                            <Button
                                variant="destructive"
                                className={`col-span-4 sm:col-span-2 border ${buttonVariants({
                                    variant: "destructive",
                                })}`}
                            >
                                {becomeTesterBtnText}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Element>

        </section>
    );
}