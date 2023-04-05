import { auth } from "$lib/auth";
import { Database } from "$lib/database";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";

export const actions: Actions = {
  logout: async ({ request, locals, cookies }) => {
    const username = locals.user.data.username;

    const { error, success } = await auth.signout(username);

    if (success) {
      cookies.delete("session");
      throw redirect(302, "/login");
    } else {
      return error.data;
    }
  },

  deleteaccount: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const username = locals.user.data.username;
    console.log(username);

    const { error, success } = await auth.delete(username);

    if (success) {
      cookies.delete("session");
      throw redirect(302, "/login");
    } else {
      return error.data;
    }
  },
};
