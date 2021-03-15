import { v4 as uuidv4 } from "uuid";

export class UuidUtils {

	public static getUuid() {
		return uuidv4();
	}

}
