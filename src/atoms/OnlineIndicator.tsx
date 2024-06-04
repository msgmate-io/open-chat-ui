import React from 'react';
import { Badge } from "../ui/badge"

export function OnlineIndicator({
    is_online
}: {
    is_online: boolean
}) {
    return is_online ?
        <Badge className="bg-transparent flex items-center content-center justify-center h-6 w-6 hover:bg-transparent">🟢</Badge>
        : <Badge className="bg-transparent flex items-center content-center justify-center h-6 w-6 hover:bg-transparent">🔴</Badge>
}
