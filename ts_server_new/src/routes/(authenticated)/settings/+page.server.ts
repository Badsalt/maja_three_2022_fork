import { Database } from "$lib/database";
import { User } from "$lib/user";
import { fail, redirect } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { loadConfigFromFile } from "vite";
import type { Actions } from "./$types";

export const actions: Actions = {
  logout: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    cookies.delete("session_ID");
    if (locals.user) {
      await (
        await Database.connect()
      ).user.update({
        where: {
          id: locals.user.userid,
        },
        data: {
          session: null,
        },
      });
    }

    throw redirect(302, "/login");
  },
  deleteaccount: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    console.log(locals.user?.userid);
    let message;
    cookies.delete("userid");
    if (locals.user) message = await Database.delete(locals.user.userid);
    if (message) {
      return fail(400, { message });
    }
  },
};
