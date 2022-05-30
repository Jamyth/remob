import { ErrorListener, Exception } from "remob";

export class ErrorHandler implements ErrorListener {
    onError(exception: Exception) {
        console.info("exception", exception);
    }
}
