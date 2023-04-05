import { init_ssr } from "$lib/ssr";
import { User } from "$lib/user";
import type { Handle } from "@sveltejs/kit";

init_ssr();

// handle runs for every request to the server
export const handle: Handle = async ({ event, resolve }) => {
  //const userid = event.cookies.get("userid");

  const session = event.cookies.get("session");

  if (event.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (session) {
    const userid: number | undefined = await User.sessionToUserid(session);
    if (userid) {
      event.locals.user = await User.read(userid);
      event.locals.session = session;
    } else {
      //console.log("User is not valid");
      event.locals.user = null;
    }
  }

  const response = await resolve(event);
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
};
