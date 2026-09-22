import { Global, Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DRIZZLE, DRIZZLE_DB, DrizzleDB } from "./database.tokens";
import { DrizzleService } from "./drizzle.service";
import * as schema from "./schema";
import { TypedConfigService } from "../config/typed-config.service";

@Global()
@Module({
  providers: [
    TypedConfigService,
    {
      provide: DRIZZLE,
      useFactory: (
        config: TypedConfigService,
      ): { db: DrizzleDB; pool: Pool } => {
        const pool = new Pool({
          connectionString: config.get("DATABASE_URL"),
          max: 10,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
        });

        const db = drizzle(pool, { schema });
        return { db, pool };
      },
    },

    {
      provide: DRIZZLE_DB,
      inject: [DRIZZLE],
      useFactory: (conn: { db: DrizzleDB }) => conn.db,
    },

    DrizzleService,
  ],
  exports: [DRIZZLE, DRIZZLE_DB, DrizzleService],
})
export class DatabaseModule {}
