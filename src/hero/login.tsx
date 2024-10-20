import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorResult } from '@msgmate-io/open-chat-typescript-client/apiTypes';
import { ReloadIcon } from "@radix-ui/react-icons";
import { EyeIcon, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export default function LoginHero({
    title = "Title",
    description = "Description",
    onSubmit = () => { },
    isFetching = false,
    error = null,
}: {
    title?: string;
    description?: string;
    onSubmit?: (data: any) => void;
    isFetching?: boolean;
    error: ErrorResult;
}) {
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                form.handleSubmit(onSubmit)();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);


    useEffect(() => {
        if (error) {
            Object.keys(error).forEach((key) => {
                // @ts-ignore
                form.setError(key, {
                    type: "server",
                    message: error[key],
                })
            });
        }
    }, [error])

    const {
        formState: { errors }
    } = form;
    console.log(error, errors)

    return (
        <div className="flex flex-col relative w-full gap-0">
            <FormProvider {...form}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem
                            className="w-full space-y-0"
                        >
                            <FormControl className="">
                                <Input type="username" placeholder="Email" {...field} className="rounded-full py-6 text-lg text-center border-2" />
                            </FormControl>
                            <FormMessage className="text-center text-sm" />
                            {!errors?.username && <div className="text-red-500 text-sm text-center">&#8203;</div>}
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem
                            className="w-full space-y-0"
                        >
                            <FormControl>
                                <div className="relative">
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" {...field} className="rounded-full py-6 text-lg text-center border-2" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                                        {showPassword ? (
                                            <EyeOff className="h-6 w-6" onClick={togglePasswordVisibility} />
                                        ) : (
                                            <EyeIcon className="h-6 w-6" onClick={togglePasswordVisibility} />
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage className="text-center text-sm" />
                            {!errors?.password && <div className="text-red-500 text-sm text-center">&#8203;</div>}
                        </FormItem>
                    )}
                />
                <Button variant="outline" type="submit" className="rounded-full border-2" form="login-form" onClick={form.handleSubmit(onSubmit)} disabled={isFetching}>
                    {isFetching && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
                {errors?.non_field_errors && <span className="text-red-500 text-sm text-center">{error?.non_field_errors}</span>}
                {!errors?.non_field_errors && <div className="text-red-500 text-sm text-center">&#8203;</div>}
            </FormProvider>
        </div>
    );
}
