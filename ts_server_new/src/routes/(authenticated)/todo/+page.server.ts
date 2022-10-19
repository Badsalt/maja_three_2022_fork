import { User } from "$lib/user";
import { ObjectId } from "mongodb";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  //console.log(locals.user?.data);
  return { user: locals.user?.data };
};

export const actions: Actions = {
  update: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    const newTodo = form.get("newTodo")?.toString();
    let status = form.get("status")?.toString();
    //console.log(form.get("status"));
    if (newTodo) {
      User.update(
        new ObjectId(locals.user?.data._id),
        { todoList: { text: newTodo, status: false } },
        false
      );
    } else if (status) {
      //Check if form name exsists.
      let temp = JSON.parse(status);
      //console.log(temp);
      User.update(
        new ObjectId(locals.user?.data._id),
        { todoList: { text: temp.text, status: temp.status } },
        false
      );
    }

    //console.log("fff ");
  },
  remove: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    const text = form.get("removeTodo")?.toString();

    if (text) {
      User.update(
        new ObjectId(locals.user?.data._id),
        { todoList: { text, status: true } },
        true
      );
    }
  },
};
