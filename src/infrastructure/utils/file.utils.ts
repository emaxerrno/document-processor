import { constants, createWriteStream } from "fs";
import { access, mkdir } from "fs/promises";
import path from "path";
import Axios from "axios";

export class FileUtils {

	public static async downloadFile(url: string, downloadFilePath: string): Promise<void | Error> {
		// ensure directory exists
		var downloadDirectory = path.dirname(downloadFilePath);
		try {
			await access(downloadDirectory, constants.W_OK);
		}
		catch (_error) {
			await mkdir(downloadDirectory);
		}

		// get stream
		try {
			const response = await Axios({
				method: "GET",
				url: url,
				responseType: "stream",
			});

			// pipe the result stream
			await response.data.pipe(
				createWriteStream(downloadFilePath)
			);
		}
		catch (error) {
			throw error;
		}
	}

}
