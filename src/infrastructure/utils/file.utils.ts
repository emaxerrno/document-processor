import { constants, createWriteStream } from "fs";
import { access, rm, mkdir, writeFile } from "fs/promises";
import path from "path";
import Axios from "axios";

export class FileUtils {

	public static async createDirectoryIfNotExists(filePath: string): Promise<void> {
		// ensure directory exists
		var directory = path.dirname(filePath);
		try {
			await access(directory, constants.W_OK);
		}
		catch (_error) {
			await mkdir(directory);
		}
	}

	public static async downloadFile(url: string, downloadFilePath: string): Promise<void> {
		// get stream
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

	public static async getFile(url: string): Promise<ArrayBuffer> {
		const response = await Axios({
			method: "GET",
			url: url,
			responseType: "arraybuffer",
		});

		return await response.data;
	}

	public static async writeFile(filePath: string, buffer: Buffer): Promise<void> {
		await writeFile(filePath, buffer);
	}

	public static async removeFile(filePath: string) {
		await rm(filePath);
	}
}
