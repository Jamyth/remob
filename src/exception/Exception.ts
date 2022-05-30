export abstract class Exception {
    /**
     * @param message is JavaScript original message, in English usually.
     * In prod environment, you are not advised to display the error message directly to end-user.
     */
    protected constructor(public message: string) {}
}
