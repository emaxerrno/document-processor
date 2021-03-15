import { documentsRouteBasePath } from "../routes/routes.const";

export class PathUtils {

	public static generateDocumentFullPath(relativePath: string): string {
		return `${documentsRouteBasePath}/${relativePath}`;
	}

}
