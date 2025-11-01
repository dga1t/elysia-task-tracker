export interface NotificationPayload {
  taskId: string;
  title: string;
  dueDate: string;
  type: "due_soon";
}

export interface NotificationQueue {
  enqueue(payload: NotificationPayload): Promise<void>;
}
