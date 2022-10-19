import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (locals.session_ID && locals.user) {
    return {
      user: locals.user.data,
      session_ID: locals.session_ID,
    };
  } else {
    throw redirect(302, "/login");
  }
};
