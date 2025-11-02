import { Task, TaskStatus } from '../entities/task'

export interface CreateTaskInput {
  title: string
  description?: string | null
  dueDate?: Date | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  dueDate?: Date | null
  status?: TaskStatus
}

export interface TaskRepository {
  create(data: CreateTaskInput): Promise<Task>
  findById(id: string): Promise<Task | null>
  findAll(status?: TaskStatus): Promise<Task[]>
  update(id: string, data: UpdateTaskInput): Promise<Task>
  delete(id: string): Promise<void>
}
