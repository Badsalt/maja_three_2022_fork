import { forumController } from "$lib/forum";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
  const stream = forumController.getStream(locals.session!, params.forum);

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
    },
  });
};
