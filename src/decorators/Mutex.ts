import { createActionHandlerDecorator } from "./createActionHandlerDecorator";

export function Mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(async (handler) => {
        if (lockTime !== null) {
            console.info(`[Action/${handler.actionName}]: Mutex Locked, Duration: ${Date.now() - lockTime}`);
        } else {
            try {
                lockTime = Date.now();
                await handler();
            } finally {
                lockTime = null;
            }
        }
    });
}
