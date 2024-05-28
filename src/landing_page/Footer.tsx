import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import { DynamicLoginButton } from "./Navbar";

export const Footer = ({
    logoImage = "",
    githubLink = "#",
    imprintLink = "#",
    privacyLink = "#",
    termsLink = "#",
}) => {
    const footerBackground = "pb-0 bg-stone-100/50 dark:bg-stone-900/50";
    return (
        <footer id="footer" className={footerBackground}>
            <Separator className="w-full" />

            <section
                className="container w-full mx-0 py-12 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8"
            >
                <div className="col-span-full md:col-span-1 ps-6">
                    <a
                        href="/"
                        className="font-bold text-xl"
                    >
                        {logoImage && logoImage.length > 0 ?
                            <img
                                src={logoImage}
                                className="w-[128px] object-contain"
                                alt="Msgmate.io Logo"
                            /> : null
                        }
                        Msgmate.io
                    </a>
                    <div className="flex h-6 mx-1 mt-12">

                        <DynamicLoginButton />
                        <Separator orientation="vertical" className="ms-2 mt-1 bg-gray-500" />
                        <a href={githubLink} className="mx-2 my-2">
                            <GitHubLogoIcon className="mr-2 w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col col-span-2 gap-5 mt-12">
                    <div className="flex content-center">
                        <Separator orientation="vertical" className="hidden md:flex mx-2 mt-1 bg-gray-500" />
                        <div className="flex flex-col gap-5">
                            <div>
                                <a
                                    href={imprintLink}
                                    className="opacity-60 hover:opacity-100"
                                >
                                    Imprint
                                </a>
                            </div>

                            <div>
                                <a
                                    href={privacyLink}
                                    className="opacity-60 hover:opacity-100"
                                >
                                    Privacy Policy
                                </a>
                            </div>

                            <div>
                                <a
                                    href={termsLink}
                                    className="opacity-60 hover:opacity-100"
                                >
                                    Terms and Conditions (AGB)
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

            </section>
            <Separator className="bg-gray-700" />
            <div className="pb-5 mt-5 text-center">
                <h3>
                    &copy; 2024{" "}
                    <a
                        target="_blank"
                        href="https://github.com/tbscode"
                        className="text-primary transition-all border-primary hover:border-b-2"
                    >
                        Tim Schupp{" "}
                    </a>
                    All Rights Reserved
                </h3>
            </div>
        </footer>
    );
};
