import { createApp, RemobUtil } from "remob";
import { ErrorHandler } from "./util/ErrorHandler";

const EntryElement = RemobUtil.lazy(() => import("./module/main"), "MainComponent");

createApp({
    componentType: EntryElement,
    errorListener: new ErrorHandler(),
});
