export class AcDeveloperError extends Error {
    constructor(from: string, message: string) {
        super(`${from} ERROR: ${message}`);
        Object.setPrototypeOf(this, AcDeveloperError.prototype);
    }
}
