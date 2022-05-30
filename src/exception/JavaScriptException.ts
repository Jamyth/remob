import { Exception } from "./Exception";

export class JavaScriptException extends Exception {
    constructor(message: string, public originalError: any) {
        super(message);
    }
}
