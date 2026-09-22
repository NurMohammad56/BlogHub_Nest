import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env.schema";

@Injectable()
export class TypedConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get<K extends keyof Env>(key: K): Env[K] {
    return this.config.get(key, { infer: true }) as Env[K];
  }

  get isProduction(): boolean {
    return this.get("NODE_ENV") === "production";
  }

  get isDevelopment(): boolean {
    return this.get("NODE_ENV") === "development";
  }

  get redisConnection(): { host: string; port: number; password?: string } {
    return {
      host: this.get("REDIS_HOST"),
      port: this.get("REDIS_PORT"),
      password: this.get("REDIS_PASSWORD"),
    };
  }
}
