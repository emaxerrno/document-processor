import { ValidationError } from "class-validator";

export class ValidationException extends Error
{
	constructor(validationErrors: ValidationError[]) {
		super();
		// Error.captureStackTrace(this, this.constructor)

		this.validationErrors = validationErrors;
	}

	public readonly validationErrors: ValidationError[];
}
