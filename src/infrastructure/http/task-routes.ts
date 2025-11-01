import { Elysia, t } from "elysia";
import { TaskService } from "../../application/services/task-service";
import { formatError } from "./http-error-handler";

export const registerTaskRoutes = (app: Elysia, service: TaskService) => {
  app.group("/tasks", (group) =>
    group
      .post(
        "",
        async ({ body, set }) => {
          try {
            const task = await service.createTask(body);
            set.status = 201;
            return { data: task };
          } catch (error) {
            const formatted = formatError(error);
            set.status = formatted.status;
            return formatted.body;
          }
        },
        {
          body: t.Object({
            title: t.String({ minLength: 1 }),
            description: t.Optional(t.String()),
            dueDate: t.Optional(t.String())
          })
        }
      )
      .get(
        "",
        async ({ query, set }) => {
          try {
            const tasks = await service.listTasks(query.status);
            return { data: tasks };
          } catch (error) {
            const formatted = formatError(error);
            set.status = formatted.status;
            return formatted.body;
          }
        },
        {
          query: t.Object({
            status: t.Optional(t.Enum({ pending: "pending", completed: "completed" }))
          })
        }
      )
      .get(
        "/:id",
        async ({ params, set }) => {
          try {
            const task = await service.getTask(params.id);
            return { data: task };
          } catch (error) {
            const formatted = formatError(error);
            set.status = formatted.status;
            return formatted.body;
          }
        },
        {
          params: t.Object({ id: t.String() })
        }
      )
      .put(
        "/:id",
        async ({ params, body, set }) => {
          try {
            const task = await service.updateTask(params.id, body);
            return { data: task };
          } catch (error) {
            const formatted = formatError(error);
            set.status = formatted.status;
            return formatted.body;
          }
        },
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({
            title: t.Optional(t.String({ minLength: 1 })),
            description: t.Optional(t.String()),
            dueDate: t.Optional(t.Union([t.String(), t.Null()])),
            status: t.Optional(t.Enum({ pending: "pending", completed: "completed" }))
          })
        }
      )
      .delete(
        "/:id",
        async ({ params, set }) => {
          try {
            await service.deleteTask(params.id);
            set.status = 204;
            return null;
          } catch (error) {
            const formatted = formatError(error);
            set.status = formatted.status;
            return formatted.body;
          }
        },
        {
          params: t.Object({ id: t.String() })
        }
      )
  );
};
