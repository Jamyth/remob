import * as React from "react";
import { RemobUtil } from "remob";
import { useMainState } from "../../main/hooks";

export const Main = RemobUtil.observer("Main", () => {
    const isAppLoaded = useMainState((state) => state.isAppLoaded);

    return <div>{isAppLoaded ? "loaded" : "not loaded"}</div>;
});
