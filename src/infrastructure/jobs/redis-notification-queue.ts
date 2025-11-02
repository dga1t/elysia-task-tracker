import Redis from 'ioredis'
import { NotificationPayload, NotificationQueue } from '../../application/ports/notification-queue'

export class RedisNotificationQueue implements NotificationQueue {
  private readonly client: Redis
  private readonly queueKey = 'task:notifications'
  private hasWarnedAboutConnection = false

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, { lazyConnect: true })

    this.client.on('ready', () => {
      this.hasWarnedAboutConnection = false
      console.log('[notification] Connected to Redis notification queue')
    })

    this.client.on('error', (error) => {
      if (!this.hasWarnedAboutConnection) {
        console.warn(
          `[notification] Redis queue error: ${(error as Error | undefined)?.message ?? error}. Notifications will be skipped until the connection recovers.`,
        )
        this.hasWarnedAboutConnection = true
      }
    })

    void this.client.connect().catch((error) => {
      console.warn(
        `[notification] Unable to connect to Redis notification queue: ${
          (error as Error | undefined)?.message ?? error
        }. Notifications will be skipped until the connection is available.`,
      )
      this.hasWarnedAboutConnection = true
    })
  }

  async enqueue(payload: NotificationPayload): Promise<void> {
    if (this.client.status !== 'ready') {
      if (!this.hasWarnedAboutConnection) {
        console.warn('[notification] Redis queue is not ready. Skipping notification enqueue.')
        this.hasWarnedAboutConnection = true
      }
      return
    }

    await this.client.rpush(this.queueKey, JSON.stringify(payload))
    console.log(`[notification] Task ${payload.taskId} due soon at ${payload.dueDate}`)
  }

  async disconnect(): Promise<void> {
    if (this.client.status === 'end') {
      return
    }

    await this.client.quit()
  }
}
