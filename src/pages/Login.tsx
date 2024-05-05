export default LoginPage;
import { LoginInfo } from "../../api/api";
import { ErrorResult } from "../../api/apiTypes";
import { useApi } from "../../api/client2";
import { navigate } from "../atoms/Link";
import LoginHero from "../hero/login";
import { LoginNavbar } from "../pages/HomePage";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Toaster } from "../ui/sonner";
import { LOGIN_AS_GUEST } from "../../constants";
import { fetchUser } from "../../store/user";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const cinematicTitle = (
    <>
        <h1 className="inline">
            Chat{" "}
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                Interface
            </span>{" "}
        </h1>

        <h2 className="inline">
            for{" "}
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                AI Agent/Bot
            </span>{" "}
            users and developers
        </h2>
    </>
)

const servicesList = [
    {
        title: "Chat With LLM's locally or in the cloud",
        description:
            "User Authentication and DB storoage with Django, SQLite or Postgres. Live Chat with Websockets, Django Channels and Redis.",
        icon: <img src={""} alt="Django Logo" />
    },
    {
        title: "Vike.dev + React + Shadcn UI",
        description:
            "Reactive modern UI rendered server side and routed client side. Styled with tailwind and daisyui.",
        icon: <img src={""} alt="Vike Logo" />
    },
]

function LoginPage({
    sectionId = "login"
}) {
    const api = useApi();
    const [error, setError] = useState<ErrorResult>(null)
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()

    const onSubmit = async (data: any) => {
        setIsFetching(true)
        const loginData: LoginInfo = {
            ...data
        }
        try {
            const user = await api.userLoginCreate(loginData)
            await dispatch(fetchUser(user))
            toast.success("Logged in as " + data.username)
            Cookies.set("clientAuthorized", true)
            setTimeout(() => {
                setIsFetching(false)
                navigate("/chat")
            }, 400)
        } catch (e) {
            setError(e.error)
            toast.error("Error: " + JSON.stringify(e.error))
            setIsFetching(false)
        }
    };

    console.log("GUEST", LOGIN_AS_GUEST)

    return <div className="h-screen w-screen flex flex-col">
        <LoginNavbar />
        <section className="container py-24 sm:py-32 flex flex-col flex-grow items-center content-center justify-center" id={sectionId}>
            <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
                <div>
                    {""}

                    <p className="text-muted-foreground text-xl mt-4 mb-8 ">
                        {""}
                    </p>

                    <div className="flex flex-col gap-8">
                        {servicesList.map(({ icon, title, description }) => (
                            <Card key={title}>
                                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                                    <div className="mt-1 p-1 rounded-2xl max-w-40 min-w-20">
                                        {icon}
                                    </div>
                                    <div>
                                        <CardTitle>{title}</CardTitle>
                                        <CardDescription className="text-md mt-2">
                                            {description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>

                <LoginHero
                    title="Msgmate.io Open Chat Interface"
                    description="Please login to continue"
                    isFetching={isFetching}
                    onSubmit={onSubmit}
                    error={error}
                />

            </div>
            <Toaster />
        </section>
    </div>
}