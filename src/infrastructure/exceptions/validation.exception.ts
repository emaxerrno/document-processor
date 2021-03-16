import { ValidationError } from "class-validator";
import { ProblemDocumentExtension } from "http-problem-details";
import { HttpException } from "./http.exception";

export class ValidationException extends HttpException
{
	constructor(validationErrors: ValidationError[]) {
		super(422, "One or more validation errors occurred.", "Please refer to the errors property for additional information.");
		// Error.captureStackTrace(this, this.constructor)

		this.validationErrors = validationErrors;
	}

	private readonly validationErrors: ValidationError[];

	getProblemDocumentExtension(): ProblemDocumentExtension {
		return {
			extensionProperties: {
				errors: this.validationErrors
			}
		};
	}
}
