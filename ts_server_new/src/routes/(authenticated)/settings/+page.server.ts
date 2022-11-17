import { Database } from "$lib/database";
import { invalid, redirect } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { loadConfigFromFile } from "vite";
import type { Actions } from "./$types";

export const actions: Actions = {
  logout: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    cookies.delete("session_ID");
    throw redirect(302, "/login");
  },
  deleteaccount: async ({ request, locals, cookies }) => {
    const form = await request.formData();
    console.log(locals.user?.userid);
    let message;
    cookies.delete("userid");
    if (locals.user) message = await Database.delete(locals.user.userid);
    if (message) {
      return invalid(400, { message });
    }
  },
};
