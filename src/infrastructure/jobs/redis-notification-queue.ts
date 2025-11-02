import Redis from 'ioredis'

import { NotificationPayload, NotificationQueue } from '../../application/ports/notification-queue'

export class RedisNotificationQueue implements NotificationQueue {
  private readonly client: Redis
  private readonly queueKey = 'task:notifications'

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl)
  }

  async enqueue(payload: NotificationPayload): Promise<void> {
    await this.client.rpush(this.queueKey, JSON.stringify(payload))
    console.log(`[notification] Task ${payload.taskId} due soon at ${payload.dueDate}`)
  }

  async disconnect(): Promise<void> {
    await this.client.quit()
  }
}
