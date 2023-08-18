import { BaseError } from "./BaseErrors";

export class NotFoundError extends BaseError {
    constructor(message: string = "Source not found.") {
        super(404, message)
    }
}