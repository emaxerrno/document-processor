export class DocumentCreated {
	constructor(path: string, thumbnailPath: string) {
		this.path = path;
		this.thumbnailPath = thumbnailPath;
	}

	path: string;
	thumbnailPath: string;
}
