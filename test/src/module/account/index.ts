import { Module, register } from "remob";
import { Main } from "./Main";

class AccountModule extends Module<"AccountModule"> {
    override onEnter(): void {
        // TODO
    }
}

const accountModule = register(new AccountModule("AccountModule"));
export const accountContext = accountModule.getContext();
export const actions = accountModule.getActions();
export const MainComponent = accountModule.attachLifecycle(Main);
