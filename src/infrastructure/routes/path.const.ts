import path from "path";
import { pathConfig } from "../config/path.config";
import { environment as env } from "./../environment/environment";

// RECONSIDER (OR REFACTOR) BEFORE CHANGING FOLDER NAME (route.const.ts depends on it)
export const publicFolderName = "public";
export const documentsFolderName = "documents";

export const rootPath: string = pathConfig[env].rootFolder;
export const publicPath: string = path.join(rootPath, publicFolderName);
export const documentsPath: string = path.join(publicPath, documentsFolderName);
