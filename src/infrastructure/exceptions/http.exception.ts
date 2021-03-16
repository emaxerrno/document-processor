export class HttpException extends Error {

	constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

	public readonly status: number;
  public readonly message: string;
}

