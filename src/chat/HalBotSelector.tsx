"use client"

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
        title: "gpt-4o",
        href: "/docs/models/gpt-4o",
        description:
            "The 4th generation of the OpenAI GPT model, trained on the OpenWebText dataset.",
    },
    {
        title: "gpt-3o",
        href: "/docs/models/gpt-3o",
        description:
            "The 3rd generation of the OpenAI GPT model, trained on the OpenWebText dataset.",
    },
    {
        title: "gpt-2o",
        href: "/docs/models/gpt-2o",
        description:
            "The 2nd generation of the OpenAI GPT model, trained on the OpenWebText dataset.",
    },
    {
        title: "gpt-1o",
        href: "/docs/models/gpt-1o",
        description:
            "The 1st generation of the OpenAI GPT model, trained on the OpenWebText dataset.",
    },
]

export function HalBotSelector() {
    const [selectedModel, setSelectedModel] = React.useState("gpt-4o")
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