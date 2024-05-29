import { navigateSearch } from "../atoms/Link";
import {
    Card
} from "../ui/card";

export function MobileBackButton() {
    return <div className="z-10 sm:hidden absolute top-0 mt-2 mr-2 right-0" onClick={() => {
        navigateSearch({ chat: null })
    }}>
        <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
            <div className="flex flex-grow items-center content-center justify-start pl-2">
                <div>👈</div>
                <div className="p-2 flex flex-grow">back</div>
            </div>
        </Card>
    </div>
}
