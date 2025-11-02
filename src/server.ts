import { Elysia } from 'elysia'
import { TaskService } from './application/services/task-service'
import { NotificationQueue } from './application/ports/notification-queue'
import { DrizzleTaskRepository } from './infrastructure/repositories/drizzle-task-repository'
import { RedisNotificationQueue } from './infrastructure/jobs/redis-notification-queue'
import { NoopNotificationQueue } from './infrastructure/jobs/noop-notification-queue'
import { env } from './infrastructure/config/env'
import { registerTaskRoutes } from './infrastructure/http/task-routes'

const repository = new DrizzleTaskRepository()
const notificationQueue: NotificationQueue = env.redisUrl
  ? new RedisNotificationQueue(env.redisUrl)
  : new NoopNotificationQueue()

if (!env.redisUrl) {
  console.warn('[notification] REDIS_URL not set. Notifications will be logged only.')
}

const taskService = new TaskService(repository, notificationQueue)

const app = new Elysia({ prefix: '/api' })

registerTaskRoutes(app, taskService)

app.get('/health', () => ({ status: 'ok' }))

app.listen(env.port, () => {
  console.log(`🚀 Server ready at http://localhost:${env.port}`)
})

process.on('SIGINT', async () => {
  await notificationQueue.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await notificationQueue.disconnect()
  process.exit(0)
})
