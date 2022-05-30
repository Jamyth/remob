import React from "react";
import { mainContext } from "./index";

export function useMainState<T>(fn: (store: React.ContextType<typeof mainContext>) => T): T {
    const store = React.useContext(mainContext);
    return fn(store);
}
