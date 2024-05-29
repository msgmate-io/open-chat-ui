import { ChatResult } from "../api/api"
import { Badge } from "../ui/badge"

export function UnreadBadge({
    chat
}: {
    chat: ChatResult
}) {
    return chat.unread_count > 0 ?
        <Badge className="bg-transparent flex flex-row items-center content-center justify-center text-black h-6 w-10 px-0 hover:bg-transparent">{`${chat.unread_count}x📮`}</Badge>
        : <></>
}
