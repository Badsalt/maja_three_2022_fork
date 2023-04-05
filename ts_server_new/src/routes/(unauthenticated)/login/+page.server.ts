import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { Database } from "$lib/database";

export const actions: Actions = {
  login: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (request) {
      if (password && username) {
        const result = await Database.login(username, password);

        if (result && result.session) {
          //If session has expire create new session
          // else change expire date

          cookies.set("session_ID", result.session, {
            path: "/",
            httpOnly: true, // optional for now
            sameSite: "strict", // optional for now
            secure: process.env.NODE_ENV === "production", // optional for now
            maxAge: 120, //
          });
          throw redirect(302, "/");
        } else {
          return fail(400, { message: "Password or username is wrong" });
        }
      } else {
        return fail(400, { message: "Password or username is empty" });
      }
    } else {
      return fail(400, {
        message: "Request is empty, please try again later.",
      });
    }
  },
};
