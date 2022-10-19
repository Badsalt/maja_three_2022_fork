import { Database } from "$lib/database";
import { invalid, redirect } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import type { Actions } from "./$types";

export const actions: Actions = {
  logout: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    cookies.delete("session_ID");
    throw redirect(302, "/login");
  },
  deleteaccount: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    cookies.delete("userid");
    const message = await Database.delete(new ObjectId(locals.user?.data._id));
    if (message) {
      return invalid(400, { message });
    }
  },
};
