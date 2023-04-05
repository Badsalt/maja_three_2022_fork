import { forumController } from "$lib/forum";
import { forumPage } from "$lib/implementations/forum";
import type { AddForumRequest } from "$lib/interfaces/forum";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  //console.log(locals.user?.data);
  const test = await forumController.load();

  return { forums: test };
};

export const actions: Actions = {
  add: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    const data2 = form.get("form-name")!.toString();
    const data: AddForumRequest = {
      userID: locals.user!.data.id,
      name: data2,
    };
    await forumController.add(data);
  },
};
