import { BaseError } from "./BaseErrors";

export class BadRequest extends BaseError {
    constructor(message: string = "Invalid requisition.") {
        super(400, message)
    }
}