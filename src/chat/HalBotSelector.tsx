import * as React from "react"

import { cn } from "../lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "../ui/navigation-menu"

const models = [
    {
        title: "llama3-70b-8192",
        href: "/docs/models/llama3-70b-8192",
        description:
            "Llama 3rd generation model with 70 billion parameters, supporting extensive context and tools.",
    },
    {
        title: "meta-llama/Meta-Llama-3-70B-Instruct",
        href: "/docs/models/meta-llama-3-70B-Instruct",
        description:
            "Meta's Llama 3, 70 billion parameter instruct model, optimized for instruction-following tasks.",
    },
    {
        title: "meta-llama/Meta-Llama-3-8B-Instruct",
        href: "/docs/models/meta-llama-3-8B-Instruct",
        description:
            "Meta's Llama 3, 8 billion parameter instruct model, tailored for lightweight instruction tasks.",
    },
    {
        title: "databricks/dbrx-instruct",
        href: "/docs/models/databricks-dbrx-instruct",
        description:
            "Databricks' DBRX Instruct model, designed for interactive and instructional applications.",
    },
    {
        title: "cognitivecomputations/dolphin-2.6-mixtral-8x7b",
        href: "/docs/models/cognitivecomputations-dolphin-2.6-mixtral-8x7b",
        description:
            "Cognitive Computations' Dolphin 2.6 Mixtral model, an advanced AI with a blend of 8x7B parameters.",
    },
    {
        title: "gpt-3.5-turbo",
        href: "/docs/models/gpt-3.5-turbo",
        description:
            "OpenAI's GPT-3.5 Turbo, an enhanced version of GPT-3, offering improved performance and efficiency.",
    },
    {
        title: "gpt-4-turbo",
        href: "/docs/models/gpt-4-turbo",
        description:
            "OpenAI's GPT-4 Turbo, the latest iteration in the GPT series, providing state-of-the-art capabilities.",
    },
    {
        title: "gpt-4o",
        href: "/docs/models/gpt-4o",
        description:
            "OpenAI's GPT-4o, optimized for specific applications with advanced tool and function support.",
    },
]

export function HalBotSelector({
    selectedModel,
    setSelectedModel,
}) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="focus:bg-base-200">
                    <NavigationMenuTrigger className="hover:bg-base-100 focus:bg-base-200">{selectedModel}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {models.map((model) => (
                                <ListItem
                                    className={cn("hover:bg-base-200 hover:text-content-neutral", {
                                        "bg-base-200": selectedModel === model.title,
                                    })}
                                    onClick={() => setSelectedModel(model.title)}
                                    key={model.title}
                                    title={model.title}
                                    href={model.href}
                                >
                                    {model.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <div
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </div>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"