import { User } from "$lib/user";
import type { Handle } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

// handle runs for every request to the server
export const handle: Handle = async ({ event, resolve }) => {
  //const userid = event.cookies.get("userid");
  const session_ID = event.cookies.get("session_ID");

  // const username = event.cookies.get("username");
  if (session_ID) {
    event.locals.session_ID = session_ID;
  }

  // if (session_ID) {
  //   event.locals.session_ID = session_ID;
  // }

  if (session_ID) {
    const userid: string | undefined = await User.sessionToUserid(session_ID);
    if (userid) event.locals.user = await User.read(new ObjectId(userid));
  }
  // if (username) {
  //   event.locals.username = username;
  // }

  return resolve(event);
};
