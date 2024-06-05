import React, { useContext } from 'react';
import { GlobalContext } from "../context";
import {
    Card
} from "../ui/card";

export function MobileBackButton() {
    const { navigate } = useContext(GlobalContext);
    return <div className="z-10 sm:hidden absolute top-0 mt-2 mr-2 right-0" onClick={() => {
        navigate({ chat: null })
    }}>
        <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
            <div className="flex flex-grow items-center content-center justify-start pl-2">
                <div>👈</div>
                <div className="p-2 flex flex-grow">back</div>
            </div>
        </Card>
    </div>
}
