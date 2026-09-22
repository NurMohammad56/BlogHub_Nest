import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const DRIZZLE = Symbol("DRIZZLE_CONNECTION");
export const DRIZZLE_DB = "DRIZZLE_DB";

export type DrizzleDB = NodePgDatabase<typeof schema>;
