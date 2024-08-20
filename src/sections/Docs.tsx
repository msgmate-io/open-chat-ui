import artitectureImage from "#/assets/open_chat_arcitecture.svg";
import React from 'react';

import { CinematicLogo } from "../atoms/CinematicLogo";
import { Button } from "../ui/button";

const sections = [{
    title: 'Project Description',
    id: 'project-description',
}, {
    title: 'Arcitecture & Stack',
    id: 'stack',
}, {
    title: 'API Reference',
    id: 'api-reference',
}]

export function Docs() {
    const [section, setSection] = React.useState(sections[0])

    return <div className="w-full h-screen flex items-center justify-center relative">
        <div className="flex flex-col grow items-center w-1/4 h-full bg-base-100">
            <div className="relative w-full z-40">
                <div className="absolute flex w-full p-4 font-bold text-2xl w-full">
                    Open-Chat
                    <div className="text-sm text-gray-500 mt-3 ml-1">by Msgmate.io (beta)</div>
                </div>
            </div>
            <div className='h-[100px] w-full'></div>
            <div className="flex flex-col items-center w-full">
                <div className="text-lg font-bold">Documentation</div>
                <div className="text-sm">v0.1.0</div>
            </div>
            <CinematicLogo />
            <div className="flex flex-col w-full grow overflow-y-auto gap-2 p-1">
                {sections.map(section => <Button variant="outline" key={section.id} onClick={() => setSection(section)} className={`w-full ${section.id === section.id ? 'bg-base-300' : 'bg-base-200'} text-left`}>
                    {section.title}
                </Button>)}
            </div>
        </div>
        <div className="flex flex-col grow w-3/4 bg-base-200 h-full max-h-screen overflow-y-auto">
            {section?.id === 'project-description' && (
                <>
                    <h1 id="project-description" className="text-4xl font-bold p-4">Project Description</h1>
                    <div className="p-4 text-base leading-normal">
                        <p>Open-Chat is an AI chat back-end and interface designed to bring LLMs and agents to your own servers and IoT devices. Bots in the system are autonomous, long-running processes managed through a robust user management system defined by the chat API.</p>
                        <h2 className="text-2xl font-semibold mt-4">Key Features:</h2>
                        <ul className="ml-4 list-disc">
                            <li>Autonomous Bots: Bots can run on any internet-connected device, utilizing local resources or integrations. They serve specific purposes and can connect with other authorized bots to create seamless AI experiences, they may use long running parallel processing and do real time event based communication.</li>
                            <li>Private AI Integration: Open-Chat enables fully private AI interactions, such as LLM voice chats that control smart home devices, without any requests leaving your network.</li>
                            <li>User Management & Access Management: The back-end features comprehensive user encapsulation, management, and authorization. Allowing to precisely mange and control agent communication and personalization.</li>
                            <li>Personalized Interaction: Bot interactions can be fully personalized without privacy concerns. Bots access the same restricted lookup APIs as any other chat user, supporting user-specific long & short-term memory or character cards.</li>
                        </ul>
                        <p className="mt-4">This makes Open-Chat the perfect tool for decentralized private AI integrations e.g., for small companies or individuals. For chat bot interfaces on webpages or monitoring and controlling IoT devices, or simply for online LLM chats based on company data/documentation or code.</p>
                    </div>
                    <div className="flex justify-center p-4">
                        <iframe width="480" height="300" src="https://www.youtube.com/embed/OqT_kIhz8Dc?si=ABasYeQNTMswr6gq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>
                    </div>
                </>
            )}
            {section?.id === 'stack' && (
                <>
                    <h1 id="stack" className="text-4xl font-bold p-4">Architecture & Stack</h1>
                    <img className="w-full h-[400px] bg-base-200 p-10" src={artitectureImage} />
                    <div className="p-4 text-base leading-normal">
                        <h2 className="text-2xl font-semibold mt-4">Technical Implementation</h2>
                        <p>The backend is primarily built with Django, Django Rest Framework (+ DRF-Spectacular for full OpenAPI schema integration), and Django Channels for WebSocket communication. Celery is used for task management, and static files sync to S3 or Whitenoise.</p>
                        <p>All APIs are implemented cleanly and fully documented. The current API documentation is available at <a href="https://beta.msgmate.io/api/schema/redoc/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">https://beta.msgmate.io/api/schema/redoc/</a>.</p>
                        <h3 className="text-xl font-semibold mt-4">Backend:</h3>
                        <ul className="ml-4 list-disc">
                            <li>Django: Core framework</li>
                            <li>Django Rest Framework: API development</li>
                            <li>Django Channels: WebSocket communication</li>
                            <li>Celery: Task management</li>
                            <li>Static file sync: S3 or Whitenoise</li>
                        </ul>
                        <h3 className="text-xl font-semibold mt-4">Frontend:</h3>
                        <ul className="ml-4 list-disc">
                            <li>React: UI library</li>
                            <li>Next.js: Framework for server-side rendering and static site generation</li>
                            <li>Vike.dev: SSR and static exports</li>
                            <li>TailwindCSS: Styling</li>
                            <li>Custom Components: Various hooks and components library</li>
                            <li>Capacitor: Native app builds</li>
                        </ul>
                        <h3 className="text-xl font-semibold mt-4">Bots:</h3>
                        <p>Bots can use any WebSocket client and any language. Existing bots primarily use Python Autobahn with a task dispatcher to manage long-running bot tasks through Celery and Flower Python libraries.</p>
                        <h3 className="text-xl font-semibold mt-4">Infrastructure:</h3>
                        <p>Development can be either containerized or run outside a container by starting the services individually. For simplicity and speed, development is fully local. The production infrastructure uses Helm charts to deploy the stack to a Kubernetes cluster, deployable on local hardware with MicroK8s or K3s, or using Docker Compose for small-scale deployments.</p>
                        <p>CI/CD pipelines are set up with GitHub Actions, and configuration is managed via .env files or Helm values/secrets.</p>
                        <h3 className="text-xl font-semibold mt-4">Services Overview:</h3>
                        <ul className="ml-4 list-disc">
                            <li><strong>backend</strong>: Django backend with chat and user management features</li>
                            <li><strong>frontend</strong>: Vike.dev frontend with chat and user management features</li>
                            <li><strong>redis</strong>: Redis for caching and chat</li>
                            <li><strong>ingress</strong>: Nginx ingress for routing, routes all traffic through localhost:80 in development</li>
                            <li><strong>hal</strong>: Default LLM model completion bot</li>
                            <li><strong>redis-hal</strong>: Redis for caching and chat for the hal bot</li>
                        </ul>
                    </div>
                </>
            )}
            {section?.id === 'api-reference' && (
                <>
                    <h1 id="api-reference" className="text-4xl font-bold p-4">API Reference</h1>
                    <div className="p-4 text-base leading-normal">
                        <p>The full API documentation is available and maintained to ensure comprehensive and clean integration for developers. Essential endpoints include:</p>
                        <ul className="ml-4 list-disc">
                            <li><strong>User Endpoints:</strong> Manage user registration, authentication, and profile updates.</li>
                            <li><strong>Chat Endpoints:</strong> Submit and retrieve messages, manage chat rooms, and fetch chat history.</li>
                            <li><strong>Bot Endpoints:</strong> Register and manage autonomous bots, handle bot commands, and monitor bot statuses.</li>
                            <li><strong>WebSocket Endpoints:</strong> Real-time messaging and event-based communication for both users and bots.</li>
                            <li><strong>Task Management:</strong> Leverage Celery for asynchronous background tasks crucial for long-running bot processes.</li>
                        </ul>
                        <p>Refer to the full API documentation at: <a href="https://beta.msgmate.io/api/schema/redoc/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">https://beta.msgmate.io/api/schema/redoc/</a> for detailed API reference and integration guides.</p>
                    </div>
                </>
            )}
        </div>
    </div>
}