import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from "@nestjs/common";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import { DRIZZLE, DrizzleDB } from "./database.tokens";

@Injectable()
export class DrizzleService implements OnApplicationShutdown {
  private readonly logger = new Logger(DrizzleService.name);
  constructor(
    @Inject(DRIZZLE) private readonly connection: { db: DrizzleDB; pool: Pool },
  ) {}

  get db(): DrizzleDB {
    return this.connection.db;
  }

  async ping(): Promise<Boolean> {
    try {
      await this.connection.db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      this.logger.error("Error pinging database", error);
      return false;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connection.pool.end();
    this.logger.log("Database connection closed");
  }
}
