import React from "react";
import { Module } from "./Module";
import { action } from "mobx";
import { ModuleLifecycleListener, ActionCreators, Store } from "../type";

export class ModuleProxy<ModuleName extends string, M extends Module<ModuleName>> {
    private module: M;
    private actions: ActionCreators<M>;
    private ModuleContext: React.Context<Store<M>>;

    constructor(module: M, actions: any) {
        this.module = module;
        this.actions = actions;
        this.ModuleContext = React.createContext<Store<M>>(this.module);
    }

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    getContext(): React.Context<Store<M>> {
        return this.ModuleContext;
    }

    attachLifecycle<Props extends object>(Component: React.ComponentType<Props>): React.ComponentType<Props> {
        const name = this.module.name;
        const store = this.module as Store<M>;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const ModuleContext = this.ModuleContext;
        ModuleContext.displayName = `StoreContext[${name}]`;

        return class extends React.PureComponent<Props> {
            static displayName = `Module[${name}]`;
            private onTickTimer: number | undefined;

            override componentDidMount() {
                if (this.hasOwnLifecycle("onEnter")) {
                    action(lifecycleListener.onEnter.bind(lifecycleListener))();
                }
                if (this.hasOwnLifecycle("onTick")) {
                    const onTick = action(lifecycleListener.onTick).bind(lifecycleListener);
                    const interval = (onTick.tickInterval || 5) * 1000;
                    this.onTickTimer = window.setInterval(onTick, interval);
                }
            }

            override componentWillUnmount() {
                if (this.hasOwnLifecycle("onDestroy")) {
                    action(lifecycleListener.onDestroy.bind(lifecycleListener))();
                }
                if (this.onTickTimer) {
                    window.clearInterval(this.onTickTimer);
                }
            }

            private hasOwnLifecycle = (methodName: keyof ModuleLifecycleListener) => {
                return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
            };

            override render() {
                return (
                    <ModuleContext.Provider value={store}>
                        <Component {...this.props} />
                    </ModuleContext.Provider>
                );
            }
        };
    }
}
