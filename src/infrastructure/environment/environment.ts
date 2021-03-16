import { env } from 'process';

export const devEnvironment: string = "development";
export const testEnvironment: string = "test";
export const prodEnvironment: string = "production";

export type Environment = "development" | "test" | "production";
export const environment: Environment = (env["NODE_ENV"] as Environment) || devEnvironment;
