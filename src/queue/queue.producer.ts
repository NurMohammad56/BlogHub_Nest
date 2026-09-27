import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import {
  EMAIL_JOBS,
  NOTIFICATION_JOBS,
  PasswordChangedJobData,
  PostPublishedJobData,
  QUEUE_NAMES,
  WelcomeEmailJobData,
} from "./queue.constants";

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.EMAIL) private readonly emailQueue: Queue,
    @InjectQueue(QUEUE_NAMES.NOTIFICATION)
    private readonly notificationQueue: Queue,
  ) {}

  async enqueueWelcomeEmail(data: WelcomeEmailJobData): Promise<void> {
    try {
      await this.emailQueue.add(EMAIL_JOBS.WELCOME, data);
      this.logger.log(`Queued welcome email for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue welcome email: ${(error as Error).message}`,
      );
    }
  }

  async enqueuePasswordChangedEmail(
    data: PasswordChangedJobData,
  ): Promise<void> {
    try {
      await this.emailQueue.add(EMAIL_JOBS.PASSWORD_CHANGED, data);
      this.logger.log(`Queued password-changed email for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue password email: ${(error as Error).message}`,
      );
    }
  }

  async enqueuePostPublishedNotification(
    data: PostPublishedJobData,
  ): Promise<void> {
    try {
      await this.notificationQueue.add(NOTIFICATION_JOBS.POST_PUBLISHED, data, {
        delay: 5000,
      });
      this.logger.log(`Queued publish notification for post ${data.postId}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue notification: ${(error as Error).message}`,
      );
    }
  }

  async getQueueStats(): Promise<Record<string, Record<string, number>>> {
    const [emailCounts, notificationCounts] = await Promise.all([
      this.emailQueue.getJobCounts(),
      this.notificationQueue.getJobCounts(),
    ]);

    return {
      [QUEUE_NAMES.EMAIL]: emailCounts,
      [QUEUE_NAMES.NOTIFICATION]: notificationCounts,
    };
  }
}
