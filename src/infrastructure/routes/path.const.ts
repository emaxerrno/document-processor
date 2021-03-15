import path from "path";
import { pathConfig } from "./path.config";
import { environment as env } from "./../environment/environment";

export const rootPath: string = pathConfig[env].rootFolder;
export const publicPath: string = path.join(rootPath, "public");
export const documentsPath: string = path.join(publicPath, "documents");
