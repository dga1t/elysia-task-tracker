import { Task } from "../../domain/entities/task";

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const toTaskDTO = (task: Task): TaskDTO => ({
  id: task.id,
  title: task.title,
  description: task.description ?? null,
  dueDate: task.dueDate?.getValue().toISOString() ?? null,
  status: task.status,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString()
});
