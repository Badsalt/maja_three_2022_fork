import type { Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { Database } from "$lib/database.js";

export const actions: Actions = {
  register: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    // const client = await Database.connect(); // Connect to the mongoDB
    // const db = client.db("test"); // select test db
    // const collection = db.collection("users"); // select users collection
    if (request) {
      let message = await Database.register(username, password);
      if (message) {
        return fail(400, { message });
      }
    } else {
      return fail(400, {
        message: "Request is empty or password or username is empty",
      });
    }
  },
};
