import type {
  Todo,
  TodoCreateRequest,
  TodoRemoveRequest,
  TodoUpdateRequest,
} from "$lib/interfaces/todo";
import { database } from "$lib/ssr";

export class TodoPage implements Todo {
  async update(data: TodoUpdateRequest): Promise<void> {
    if (data.username && data.id) {
      await database.user.update({
        where: {
          username: data.username,
        },
        data: {
          todos: {
            update: {
              where: {
                id: data.id,
              },
              data: {
                status: data.status,
              },
            },
          },
        },
      });
    }
  }
  async create(data: TodoCreateRequest): Promise<void> {
    if (data.username && data.text) {
      const ownerId = await database.user.findFirst({
        where: { username: data.username },
        select: { id: true },
      });
      console.log(ownerId + "fff");
      if (ownerId)
        await database.todo.create({
          data: {
            status: data.status,
            text: data.text,
            ownerId: ownerId.id,
          },
        });
    }
  }
  async remove(data: TodoRemoveRequest): Promise<void> {
    await database.todo.delete({
      where: {
        id: data.id,
      },
    });
  }
}
