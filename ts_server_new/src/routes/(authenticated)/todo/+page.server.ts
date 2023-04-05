import { User, type UserData } from "$lib/user";
import { ObjectId } from "mongodb";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  //console.log(locals.user?.data);
  return { user: locals.user?.data };
};

export const actions: Actions = {
  update: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const status = form.get("status")!.toString();

    const data = JSON.parse(status);

    //console.log(form.get("status"));
    if (locals.user && status) {
      //TODO: Prevent adding two todos with same text
      User.update(
        locals.user?.userid,
        { todoList: { id: data.id, text: data.text, status: data.status } },
        false
      );
    }

    //console.log("fff ");
  },
  create: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    const newTodo = form.get("newTodo")!.toString();

    if (locals.user && newTodo) {
      User.create(locals.user.userid, newTodo);
    }
  },
  remove: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    const _id = form.get("removeTodoID")!.toString();
    const id = parseInt(_id);

    if (id && locals.user) {
      User.update(
        locals.user?.userid,
        { todoList: { id, status: true, text: "ss" } },
        true
      );
    }
  },
};
