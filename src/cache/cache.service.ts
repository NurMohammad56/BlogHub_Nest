import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";

export const CacheKeys = {
  post: (idOrSlug: string) => `post:${idOrSlug}`,
  postList: (fingerprint: string) => `posts:list:${fingerprint}`,
  postListPrefix: () => "posts:list:",
  user: (id: string) => `user:${id}`,
} as const;

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cache.get<T>(key);
      if (value !== undefined && value !== null) {
        this.logger.debug(`CACHE HIT  → ${key}`);
        return value;
      }
      this.logger.debug(`CACHE MISS → ${key}`);
      return undefined;
    } catch (error) {
      this.logger.warn(
        `Cache get failed for ${key}: ${(error as Error).message}`,
      );
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      await this.cache.set(
        key,
        value,
        ttlSeconds ? ttlSeconds * 1000 : undefined,
      );
      this.logger.debug(`CACHE SET  → ${key}`);
    } catch (error) {
      this.logger.warn(
        `Cache set failed for ${key}: ${(error as Error).message}`,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cache.del(key);
      this.logger.debug(`CACHE DEL  → ${key}`);
    } catch (error) {
      this.logger.warn(
        `Cache delete failed for ${key}: ${(error as Error).message}`,
      );
    }
  }

  async delMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.del(key)));
  }

  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const fresh = await factory();

    if (fresh !== undefined && fresh !== null) {
      await this.set(key, fresh, ttlSeconds);
    }

    return fresh;
  }
}
