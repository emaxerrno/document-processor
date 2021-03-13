import { IsString, IsUrl } from "class-validator";

export default class CreateDocument
{
	constructor(url: string) {
		this.url = url;
	}

	@IsString()
	@IsUrl({
		require_protocol: true,
		require_valid_protocol: true
	}, {
		message: "Must be a valid url."
	})
	url: string;
}
