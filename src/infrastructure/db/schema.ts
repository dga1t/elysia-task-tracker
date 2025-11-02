import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date', { withTimezone: false, mode: 'date' }),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: false, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false, mode: 'date' })
    .notNull()
    .defaultNow()
})
