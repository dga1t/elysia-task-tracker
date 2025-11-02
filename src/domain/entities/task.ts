import { DueDate } from '../value-objects/due-date'

export type TaskStatus = 'pending' | 'completed'

export interface TaskProps {
  id: string
  title: string
  description?: string | null
  dueDate?: DueDate | null
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export class Task {
  private props: TaskProps

  constructor(props: TaskProps) {
    this.props = { ...props }
  }

  get id(): string {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string | null | undefined {
    return this.props.description
  }

  get dueDate(): DueDate | null | undefined {
    return this.props.dueDate
  }

  get status(): TaskStatus {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  update(props: Partial<Omit<TaskProps, 'id' | 'createdAt'>>): void {
    if (props.title !== undefined) {
      this.props.title = props.title
    }

    if (props.description !== undefined) {
      this.props.description = props.description
    }

    if (props.dueDate !== undefined) {
      this.props.dueDate = props.dueDate
    }

    if (props.status !== undefined) {
      this.props.status = props.status
    }

    this.props.updatedAt = props.updatedAt ?? new Date()
  }

  toJSON(): TaskProps {
    return { ...this.props }
  }
}
