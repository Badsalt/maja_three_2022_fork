import { Database } from "$lib/database";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import rehypeSlug from "rehype-slug";
import rehypeAutoLink from "rehype-autolink-headings";

import type { Forum } from "@prisma/client";
import { forumController } from "$lib/forum";
import type {
  ForumInclusive,
  WriteMessageRequest,
} from "$lib/interfaces/forum";
import { compile } from "mdsvex";

const remarkPlugins = undefined;
const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutoLink,
    {
      behavior: "wrap",
      properties: { class: "hover:text-yellow-100 no-underline" },
    },
  ],
];

export const load: PageServerLoad = async ({ params, request, locals }) => {
  const forum = await forumController.loadOneForum(params.forum);

  return {
    forum,
    user: locals.user?.data,
  };
};

export const actions: Actions = {
  write: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(302, "/login");
    const form = await request.formData();
    const message = form.get("message")?.toString();
    if (!message) {
      return fail(400, { error: "missing message" });
    }

    // What forum are we writing to?
    const forum = await (
      await Database.connect()
    ).forum.findFirst({
      where: {
        name: params.forum,
      },
    });

    if (!forum) throw error(404, "Not found");

    const data: WriteMessageRequest = {
      forum,
      message,
      user: locals.user,
    };

    await forumController.writeMessage(data);
    /*const markdownMessage = (
      await compile(
        message,
        remarkPlugins,
        // @ts-ignore
        rehypePlugins
      )
    )?.code
      // https://github.com/pngwn/MDsveX/issues/392
      .replace(/>{@html `<code class="language-/g, '><code class="language-')
      .replace(/<\/code>`}<\/pre>/g, "</code></pre>"); */

    //create message in the database
    const msg = await (
      await Database.connect()
    ).message.create({
      data: {
        formId: forum.id,
        content: message,
        authorId: locals.user!.data.id,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    //console.log(msg.content)
    /*
    // send the message to all connected clients.
    for (const session in streams) {
      //console.log(session);
      // send messages to all other streams exept own for this chat
      const connection = streams[session];
      if (connection.forum == params.forum && session != locals.session) {
        // enqueue messages to all streams for this chat
        connection.controller.enqueue(JSON.stringify(msg));
      }
    } */
  },
};
