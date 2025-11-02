import { eq } from 'drizzle-orm'

import { Task, TaskStatus } from '../../domain/entities/task'
import {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput
} from '../../domain/repositories/task-repository'
import { DueDate } from '../../domain/value-objects/due-date'
import { db } from '../db/connection'
import { tasks } from '../db/schema'

const toEntity = (record: typeof tasks.$inferSelect): Task => {
  return new Task({
    id: record.id,
    title: record.title,
    description: record.description,
    dueDate: record.dueDate ? DueDate.create(record.dueDate) : null,
    status: record.status as TaskStatus,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  })
}

export class DrizzleTaskRepository implements TaskRepository {
  async create(data: CreateTaskInput): Promise<Task> {
    const [created] = await db
      .insert(tasks)
      .values({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ?? null
      })
      .returning()

    return toEntity(created)
  }

  async findById(id: string): Promise<Task | null> {
    const [record] = await db.select().from(tasks).where(eq(tasks.id, id))
    return record ? toEntity(record) : null
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    let query = db.select().from(tasks)

    if (status) {
      query = query.where(eq(tasks.status, status))
    }

    const records = await query.orderBy(tasks.createdAt)
    return records.map(toEntity)
  }

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ?? (data.dueDate === null ? null : undefined),
        status: data.status,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning()

    if (!updated) {
      throw new Error('Task not found')
    }

    return toEntity(updated)
  }

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id))
  }
}
