export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATION: 'notification',
} as const;

export const EMAIL_JOBS = {
  WELCOME: 'send-welcome-email',
  PASSWORD_CHANGED: 'send-password-changed-email',
} as const;

export const NOTIFICATION_JOBS = {
  POST_PUBLISHED: 'notify-post-published',
} as const;

export interface WelcomeEmailJobData {
  userId: string;
  email: string;
  name: string;
}

export interface PasswordChangedJobData {
  userId: string;
  email: string;
  changedAt: string;
}

export interface PostPublishedJobData {
  postId: string;
  postTitle: string;
  authorId: string;
  authorName: string;
}
