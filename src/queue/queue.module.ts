import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypedConfigService } from "../config/typed-config.service";
import { EmailProcessor } from "./processors/email.processor";
import { NotificationProcessor } from "./processors/notification.processor";
import { QUEUE_NAMES } from "./queue.constants";
import { QueueProducerService } from "./queue.producer";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [TypedConfigService],
      useFactory: (config: TypedConfigService) => ({
        connection: config.redisConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 1000 },
        },
      }),
    }),

    BullModule.registerQueue(
      { name: QUEUE_NAMES.EMAIL },
      { name: QUEUE_NAMES.NOTIFICATION },
    ),
  ],
  providers: [
    TypedConfigService,
    QueueProducerService,
    EmailProcessor,
    NotificationProcessor,
  ],
  exports: [QueueProducerService, BullModule],
})
export class QueueModule {}
