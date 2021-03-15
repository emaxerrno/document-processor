import xxhashjs from "xxhashjs";
import { hashConfig } from "../config/hash.config";
import { environment as env } from "./../environment/environment";

export class HashUtils {

	public static generate(data: string | ArrayBuffer | Buffer): string {
		// TODO: seed
		return xxhashjs.h64(data, hashConfig[env].salt).toString();
	}

}
