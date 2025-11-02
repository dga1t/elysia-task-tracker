import { z } from 'zod'

import { Task } from '../../domain/entities/task'
import { TaskRepository } from '../../domain/repositories/task-repository'
import { DueDate } from '../../domain/value-objects/due-date'
import { toTaskDTO, TaskDTO } from '../dto/task-dto'
import { ApplicationError } from '../exceptions/application-error'
import { NotificationQueue } from '../ports/notification-queue'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional()
})

const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.coerce.date().optional().nullable(),
    status: z.enum(['pending', 'completed']).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  })

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly notificationQueue: NotificationQueue
  ) {}

  async createTask(input: unknown): Promise<TaskDTO> {
    const result = createTaskSchema.safeParse(input)
    if (!result.success) {
      throw new ApplicationError(result.error.message, 422)
    }

    const dueDate = result.data.dueDate ? DueDate.create(result.data.dueDate) : null

    const task = await this.repository.create({
      title: result.data.title,
      description: result.data.description,
      dueDate: dueDate?.getValue() ?? null
    })

    await this.scheduleNotification(task)

    return toTaskDTO(task)
  }

  async listTasks(status?: string): Promise<TaskDTO[]> {
    if (status && status !== 'pending' && status !== 'completed') {
      throw new ApplicationError('Invalid status filter', 422)
    }

    const tasks = await this.repository.findAll(status as 'pending' | 'completed' | undefined)
    return tasks.map(toTaskDTO)
  }

  async getTask(id: string): Promise<TaskDTO> {
    const task = await this.repository.findById(id)
    if (!task) {
      throw new ApplicationError('Task not found', 404)
    }

    return toTaskDTO(task)
  }

  async updateTask(id: string, input: unknown): Promise<TaskDTO> {
    const result = updateTaskSchema.safeParse(input)
    if (!result.success) {
      throw new ApplicationError(result.error.message, 422)
    }

    const existing = await this.repository.findById(id)
    if (!existing) {
      throw new ApplicationError('Task not found', 404)
    }

    const dueDate = result.data.dueDate ? DueDate.create(result.data.dueDate) : null

    const updated = await this.repository.update(id, {
      title: result.data.title,
      description: result.data.description,
      dueDate: dueDate?.getValue() ?? (result.data.dueDate === null ? null : undefined),
      status: result.data.status
    })

    await this.scheduleNotification(updated)

    return toTaskDTO(updated)
  }

  async deleteTask(id: string): Promise<void> {
    const existing = await this.repository.findById(id)
    if (!existing) {
      throw new ApplicationError('Task not found', 404)
    }

    await this.repository.delete(id)
  }

  private async scheduleNotification(task: Task) {
    const dueDate = task.dueDate

    if (!dueDate) {
      return
    }

    if (dueDate.isWithinNextHours(24)) {
      await this.notificationQueue.enqueue({
        taskId: task.id,
        title: task.title,
        dueDate: dueDate.getValue().toISOString(),
        type: 'due_soon'
      })
    }
  }
}
