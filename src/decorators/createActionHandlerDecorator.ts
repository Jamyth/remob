import type { Module } from "../core/Module";
import type { ActionReturn, ActionHandler } from "../type";

/**
 * Decorator type declaration, required by TypeScript.
 */
type HandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ActionHandler>,
) => TypedPropertyDescriptor<ActionHandler>;
type ActionHandlerWithMetaData = ActionHandler & { actionName: string };
type HandlerInterceptor = (handler: ActionHandlerWithMetaData, thisModule: Module<any>) => ActionReturn;

export function createActionHandlerDecorator(interceptor: HandlerInterceptor): HandlerDecorator {
    return (_target, _propertyKey, descriptor) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- class method must have value
        const fn = descriptor.value!;
        descriptor.value = async function (...args: any[]): Promise<void> {
            const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
            // Do not use fn.actionName, it returns undefined
            // The reason is, fn is created before module register(), and the actionName had not been attached then
            boundFn.actionName = (descriptor.value as any).actionName;
            await interceptor(boundFn, this as any);
        };
        return descriptor;
    };
}
