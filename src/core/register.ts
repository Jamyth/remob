import { ModuleProxy } from "./ModuleProxy";
import { action as mobxAction } from "mobx";
import { ErrorUtil } from "../util/ErrorUtil";
import type { Module } from "./Module";
import type { MutableActionCreators, ActionCreators, HandlerKeys, ActionCreator, ActionReturn } from "../type";

export function register<M extends Module<any>>(module: M) {
    const actions = getModuleAction(module);
    return new ModuleProxy(module, actions);
}

function getModuleAction<M extends Module<any>>(module: M): ActionCreators<M> {
    const actionNames: HandlerKeys<M>[] = getActionNames(module);
    const actionList: MutableActionCreators<M> = {} as any;
    actionNames.forEach((_) => {
        const action: ActionCreator<M[HandlerKeys<M>]> = (module as any)[_];
        actionList[_] = toSafeAction<M, any[]>(mobxAction(action).bind(module), _ as string);
    });

    return actionList;
}

function toSafeAction<M extends Module<any>, Args extends any[]>(
    action: (...args: Args) => ActionReturn,
    actionName: string,
): ActionCreator<M[HandlerKeys<M>]> {
    return (async (...args: Args) => {
        try {
            await action(...args);
        } catch (error) {
            ErrorUtil.captureError(error, actionName);
        }
    }) as ActionCreator<M[HandlerKeys<M>]>;
}

function getActionNames<M extends Module<any>>(module: M): HandlerKeys<M>[] {
    const keys: string[] = [];
    for (const actionName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if ((module as any)[actionName] instanceof Function && actionName !== "constructor") {
            keys.push(actionName);
        }
    }
    return keys as HandlerKeys<M>[];
}
