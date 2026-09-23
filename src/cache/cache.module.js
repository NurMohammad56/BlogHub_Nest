import KeyvRedis from '@keyv/redis';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { Keyv } from 'keyv';
import { TypedConfigService } from '../config/typed-config.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [TypedConfigService],
      useFactory: (config: TypedConfigService) => {
        const { host, port, password } = config.redisConnection;
        const auth = password ? `:${encodeURIComponent(password)}@` : '';
        const redisUrl = `redis://${auth}${host}:${port}`;

        return {
          stores: [new Keyv({ store: new KeyvRedis(redisUrl) })],
          ttl: config.get('CACHE_TTL_SECONDS') * 1000,
        };
      },
    }),
  ],
  providers: [TypedConfigService, CacheService],
  exports: [NestCacheModule, CacheService],
})
export class AppCacheModule {}
