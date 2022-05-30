import { NetworkConnectionException } from "../exception/NetworkException";
import { createActionHandlerDecorator } from "./createActionHandlerDecorator";

export function RetryOnNetworkConnectionError(retryIntervalInSec = 3, maxTry = 5) {
    return createActionHandlerDecorator(async (handler) => {
        let retryTime = 0;
        while (retryTime < maxTry) {
            try {
                // eslint-disable-next-line no-await-in-loop -- won't loop too long
                await handler();
                break;
            } catch (error) {
                if (error instanceof NetworkConnectionException) {
                    retryTime++;
                    console.warn(
                        `[Action/${handler.actionName}]: Network Connection Error occur, will retry #${retryTime}`,
                    );
                    // eslint-disable-next-line no-await-in-loop -- won't loop too long
                    await new Promise<void>((res) => setTimeout(res, retryIntervalInSec * 1000));
                } else {
                    throw error;
                }
            }
        }
    });
}
