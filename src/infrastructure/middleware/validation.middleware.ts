import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { plainToClass } from 'class-transformer';

export function validationMiddleware<T extends object>(
	type: T,
	value: 'body' | 'query' | 'params' = 'body',
	skipMissingProperties = false
): RequestHandler {
	return validationMiddlewareWithOptions<T>(type, value, {
		validationError: { target: false },
		skipMissingProperties: skipMissingProperties
	});
}

export function validationMiddlewareWithOptions<T extends object>(
	type: T,
	value: 'body' | 'query' | 'params' = 'body',
	options?: ValidatorOptions
): RequestHandler {
	return (req: Request, _res: Response, next: NextFunction): void => {
		validate(plainToClass(type as any, req[value]), options)
			.then((errors: ValidationError[]) => {
				if (errors.length > 0) {
					next(new ValidationException(errors));
				} else {
					next();
				}
			});
	}
}

export default validationMiddleware;
