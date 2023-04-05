import { Database } from "$lib/database";
import { User } from "$lib/user";
import type { Handle } from "@sveltejs/kit";

import { ObjectId } from "mongodb";

// handle runs for every request to the server
export const handle: Handle = async ({ event, resolve }) => {
  //const userid = event.cookies.get("userid");

  const session = event.cookies.get("session_ID");

  // if (session_ID) {
  //   event.locals.session_ID = session_ID;
  // }

  if (session) {
    const userid: number | undefined = await User.sessionToUserid(session);
    if (userid) {
      event.locals.user = await User.read(userid);
      event.locals.session = session;
    } else {
      console.log("User is not valid");
      event.locals.user = null;
    }
  }

  return resolve(event);
};
