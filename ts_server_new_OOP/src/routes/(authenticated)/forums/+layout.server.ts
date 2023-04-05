import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  //console.log(locals.user?.data);
  return { user: locals.user?.data };
};
