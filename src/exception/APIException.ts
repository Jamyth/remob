import { Exception } from "./Exception";

export class APIException extends Exception {
    constructor(
        message: string,
        public statusCode: number,
        public requestURL: string,
        public responseData: any,
        public errorId: string | null,
        public errorCode: string | null,
    ) {
        super(message);
    }
}
