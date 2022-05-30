import type { TickIntervalDecoratorFlag, ActionHandler } from "../type";

type OnTickHandlerDecorator = (
    target: object,
    propertyKey: "onTick",
    descriptor: TypedPropertyDescriptor<ActionHandler & TickIntervalDecoratorFlag>,
) => TypedPropertyDescriptor<ActionHandler>;

/**
 * For onTick() action only, to specify to tick interval in second.
 */
export function Interval(second: number): OnTickHandlerDecorator {
    return (_target, _propertyKey, descriptor) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- onTick is present
        descriptor.value!.tickInterval = second;
        return descriptor;
    };
}
