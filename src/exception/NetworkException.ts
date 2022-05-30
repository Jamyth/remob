import { Exception } from "./Exception";

export class NetworkConnectionException extends Exception {
    constructor(message: string, public requestURL: string, public originalErrorMessage: string = "") {
        super(message);
    }
}
