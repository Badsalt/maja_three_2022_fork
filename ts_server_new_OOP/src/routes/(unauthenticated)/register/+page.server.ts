import type { Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const actions: Actions = {
  register: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const { success, error } = await auth.register(form);

    if (error) {
      return fail(error.code, error);
    } else {
      cookies.set("session", success.user.session, {
        path: "/",
        httpOnly: true, // optional for now
        sameSite: "strict", // optional for now
        secure: process.env.NODE_ENV === "production", // optional for now
        maxAge: 1200, //
      });
      locals.user = success.user;
      throw redirect(302, "/");
    }
  },
};
