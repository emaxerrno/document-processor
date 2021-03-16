import { ProblemDocument, ProblemDocumentExtension } from "http-problem-details";
import { ProblemDocumentOptions } from "http-problem-details/dist/ProblemDocument";

export class HttpException extends Error {

	constructor(status: number, title: string, details?: string, instance?: string) {
		super(title);
		this.status = status;
		this.title = title;
		this.details = details;
		this.instance = instance;
		this.type = `https://httpstatuses.com/${status}`;
	}

	public readonly status: number;
	public readonly title: string;
	public readonly details?: string;
	public readonly instance?: string;
	public readonly type?: string;

	getProblemDocument(): ProblemDocument {
		const problemDocumentExtension = this.getProblemDocumentExtension();
		const problemDocumentOptions: ProblemDocumentOptions = Object.assign({}, {
			status: this.status,
			title: this.title,
			detail: !this.details ? undefined : this.details,
			instance: !this.instance ? undefined : this.instance,
			type: !this.type ? undefined : this.type
		});

		if (problemDocumentExtension !== null) {
			return new ProblemDocument(problemDocumentOptions, problemDocumentExtension);
		}

		return new ProblemDocument(problemDocumentOptions);
	}

	getProblemDocumentExtension(): ProblemDocumentExtension | null {
		return null;
	}
}
