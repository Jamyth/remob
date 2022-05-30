import { NetworkConnectionException } from "../exception/NetworkException";
import { createActionHandlerDecorator } from "./createActionHandlerDecorator";

/**
 * Do nothing (only create a warning log) if NetworkConnectionException is thrown.
 * Mainly used for background tasks.
 */
export function SilenceOnNetworkConnectionError() {
    return createActionHandlerDecorator(async (handler) => {
        try {
            await handler();
        } catch (error) {
            if (error instanceof NetworkConnectionException) {
                console.warn(`[Action/${handler.actionName}]: Network Connection Error occur, will keep it silence.`);
            } else {
                throw error;
            }
        }
    });
}
