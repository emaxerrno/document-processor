import { env } from 'process';

export type Environment = 'development' | 'test' | 'production';
export const environment: Environment = (env["NODE_ENV"] as Environment) || "development";
