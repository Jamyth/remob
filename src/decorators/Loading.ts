import { createActionHandlerDecorator } from "./createActionHandlerDecorator";
import { rootStore } from "../rootStore";

/**
 * Decorator type declaration, required by TypeScript.
 */
type AsyncActionHandler = (...args: any[]) => Promise<void>;
type AsyncHandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<AsyncActionHandler>,
) => TypedPropertyDescriptor<AsyncActionHandler>;

export function Loading(identifier?: string): AsyncHandlerDecorator {
    return createActionHandlerDecorator(async (handler) => {
        try {
            rootStore.setLoading(true, identifier);
            await handler();
        } finally {
            rootStore.setLoading(false, identifier);
        }
    }) as any;
}
