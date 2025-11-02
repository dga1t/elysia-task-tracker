import { NotificationPayload, NotificationQueue } from '../../application/ports/notification-queue'

export class NoopNotificationQueue implements NotificationQueue {
  async enqueue(payload: NotificationPayload): Promise<void> {
    console.warn(
      `[notification] Redis queue disabled. Skipping notification for task ${payload.taskId} due at ${payload.dueDate}`,
    )
  }

  async disconnect(): Promise<void> {
    // nothing to clean up
  }
}
