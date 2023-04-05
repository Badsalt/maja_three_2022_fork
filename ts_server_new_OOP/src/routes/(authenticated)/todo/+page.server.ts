import type { Actions, PageServerLoad } from "./$types";

import { todo } from "$lib/todo";
import type {
  TodoCreateRequest,
  TodoRemoveRequest,
  TodoUpdateRequest,
} from "$lib/interfaces/todo";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  //console.log(locals.user?.data);
  return { user: locals.user?.data };
};

export const actions: Actions = {
  update: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    let status = JSON.parse(form.get("status")!.toString());

    const data: TodoUpdateRequest = {
      username: locals.user!.data.username,
      id: status.id,
      status: status.status,
    };

    await todo.update(data);
  },
  create: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    let newTodo = form.get("newTodo")!.toString();

    const data: TodoCreateRequest = {
      username: locals.user!.data.username,
      text: newTodo,
      status: false,
    };

    console.log(data);

    await todo.create(data);
  },
  remove: async ({ request }) => {
    const form = await request.formData();
    const _id = form.get("removeTodoID")!.toString();
    const id = parseInt(_id);

    const data: TodoRemoveRequest = {
      id,
    };

    await todo.remove(data);
  },
};
