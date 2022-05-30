import React from "react";
import { observer as mobxReactObserver } from "mobx-react-lite";
import { rootStore } from "../rootStore";
import { ErrorUtil } from "./ErrorUtil";
import { SpecifiedExceptionType } from "../exception/SpecifiedExceptionType";
import type { IObserverOptions } from "mobx-react-lite";

type ReactComponentKeyOf<T> = { [P in keyof T]: T[P] extends React.ComponentType<any> ? P : never }[keyof T];

interface WrapperComponentState {
    Component: React.ComponentType<any> | null;
    error: unknown | null;
}

export interface AsyncOptions {
    loadingIdentifier?: string;
    LoadingComponent?: React.ComponentType;
    ErrorComponent?: React.ComponentType<AsyncErrorComponentProps>;
}

export interface AsyncErrorComponentProps {
    error: unknown;
    reload: () => Promise<void>;
}

function observer<P extends object, TRef = object>(
    displayName: string,
    baseComponent: React.RefForwardingComponent<TRef, P>,
    options?: IObserverOptions & {
        forwardRef: true;
    },
) {
    return Object.assign(mobxReactObserver(baseComponent, options), { displayName });
}

function lazy<T, K extends ReactComponentKeyOf<T>>(
    resolve: () => Promise<T>,
    component: K,
    { LoadingComponent, loadingIdentifier, ErrorComponent }: AsyncOptions = {},
): T[K] {
    /**
     * It is possible to write in Functional Component,
     * but the importing Component might be a functional component as well: () => React.ReactElement;
     * using React.useState()'s setState function might cause error (setState accept callback / value);
     *
     * The result would look like:
     * const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
     *
     * setComponent(() => moduleExports[component] as any);
     */
    return class AsyncWrapperComponent extends React.PureComponent<{}, WrapperComponentState> {
        constructor(props: {}) {
            super(props);
            this.state = { Component: null, error: null };
        }

        override componentDidMount() {
            this.loadComponent();
        }

        loadComponent = async () => {
            try {
                this.setState({ error: null });
                rootStore.setLoading(true, loadingIdentifier);
                const moduleExports = await resolve();
                this.setState({ Component: moduleExports[component] as any });
            } catch (e) {
                ErrorUtil.captureError(e, SpecifiedExceptionType.ASYNC_IMPORT);
                this.setState({ error: e });
            } finally {
                rootStore.setLoading(false, loadingIdentifier);
            }
        };

        override render() {
            const { Component, error } = this.state;
            const hasError = error !== null;

            if (hasError) {
                return ErrorComponent ? <ErrorComponent error={error} reload={this.loadComponent} /> : null;
            }

            return Component ? <Component {...this.props} /> : LoadingComponent ? <LoadingComponent /> : null;
        }
    } as any;
}

export const RemobUtil = Object.freeze({
    observer,
    lazy,
});
