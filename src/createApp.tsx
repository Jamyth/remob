import React from "react";
import ReactDOM from "react-dom";
import { SpecifiedExceptionType } from "./exception/SpecifiedExceptionType";
import { ErrorUtil } from "./util/ErrorUtil";
import { ErrorBoundary } from "./component/ErrorBoundary";
import type { ErrorListener } from "./type";

export interface CreateAppOption {
    componentType: React.ComponentType;
    errorListener: ErrorListener;
    rootContainer?: HTMLElement;
}

export function createApp(option: CreateAppOption) {
    setupGlobalErrorHandler(option.errorListener);
    renderRoot(option.componentType, option.rootContainer || injectRootContainer());
}

export function setupGlobalErrorHandler(errorListener: ErrorListener) {
    const errorHandler = errorListener.onError.bind(errorListener);
    ErrorUtil.setErrorHandler(errorHandler);

    window.addEventListener(
        "error",
        (event) => {
            try {
                const analyzeByTarget = (): string => {
                    if (event.target && event.target !== window) {
                        const element = event.target as HTMLElement;
                        return `DOM source error: ${element.outerHTML}`;
                    }
                    return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                };
                ErrorUtil.captureError(
                    event.error || event.message || analyzeByTarget(),
                    SpecifiedExceptionType.GLOBAL_ERROR_ACTION,
                );
            } catch (error) {
                /**
                 * This should not happen normally.
                 * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
                 * A typical example is: Permission denied to access property `foo`
                 */
                console.error(
                    `[Action/${SpecifiedExceptionType.GLOBAL_ERROR_ACTION}]: Error Handler Failure, ${
                        ErrorUtil.errorToException(error).message
                    }`,
                );
            }
        },
        true,
    );

    window.addEventListener(
        "unhandledrejection",
        (event) => {
            try {
                ErrorUtil.captureError(event.reason, SpecifiedExceptionType.GLOBAL_PROMISE_REJECTION_ACTION);
            } catch (error) {
                console.error(
                    `[Action/${SpecifiedExceptionType.GLOBAL_PROMISE_REJECTION_ACTION}]: Error Handler Failure, ${
                        ErrorUtil.errorToException(error).message
                    }`,
                );
            }
        },
        true,
    );
}

function renderRoot(EntryElement: React.ComponentType, rootContainer: HTMLElement) {
    ReactDOM.render(
        <ErrorBoundary>
            <EntryElement />
        </ErrorBoundary>,
        rootContainer,
    );
}

function injectRootContainer() {
    const rootContainer = document.createElement("div");
    rootContainer.id = "remob-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
