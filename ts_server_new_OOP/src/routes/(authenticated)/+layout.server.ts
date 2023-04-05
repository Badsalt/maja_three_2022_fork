import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.user && !cookies.get("session_ID")) throw redirect(302, "/login");
};
