import { publicFolderName, documentsFolderName } from "./path.const";
import { hostConfig } from "../config/host.config";
import { environment as env } from "./../environment/environment";

export const staticRouteName = publicFolderName;
export const documentsRouteName = documentsFolderName;

// TODO: improve (double slashes etc)
export const documentsRouteBasePath: string = `${hostConfig[env].baseUrl}/${staticRouteName}/${documentsRouteName}`;
