import type {
  AddForumRequest,
  ForumController,
  WriteMessageRequest,
} from "$lib/interfaces/forum";
import { database, streams } from "$lib/ssr";
import type { Forum } from "@prisma/client";
import { error, fail } from "@sveltejs/kit";
import { compile } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutoLink from "rehype-autolink-headings";

export class forumPage implements ForumController {
  getStream(session: string, forum: string): ReadableStream<string> {
    const stream = new ReadableStream<string>({
      start(controller) {
        /* save the controller for the stream so that we can */
        /* enqueue messages into the stream */
        streams[session!] = { controller, forum: forum };
      },
      cancel() {
        /* remove the stream */
        delete streams[session!];
      },
    });
    return stream;
  }

  async add(data: AddForumRequest): Promise<void> {
    await database.forum.create({
      data: {
        name: data.name,
        ownerId: data.userID,
      },
    });
  }
  async load(): Promise<Forum[]> {
    const result: Forum[] = await database.forum.findMany({});
    return result;
  }

  async loadOneForum(name: string): Promise<Forum> {
    const forum = await database.forum.findFirst({
      where: {
        name,
      },
      include: {
        messages: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
        Owner: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!forum) throw error(404, "Not found");

    return forum;
  }
  async writeMessage(data: WriteMessageRequest): Promise<void> {
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

    const markdownMessage = (
      await compile(
        data.message,
        remarkPlugins,
        // @ts-ignore
        rehypePlugins
      )
    )?.code
      // https://github.com/pngwn/MDsveX/issues/392
      .replace(/>{@html `<code class="language-/g, '><code class="language-')
      .replace(/<\/code>`}<\/pre>/g, "</code></pre>");

    const msg = await database.message.create({
      data: {
        formId: data.forum.id,
        content: markdownMessage ?? data.message,
        authorId: data.user.data.id,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    // send the message to all connected clients.
    for (const session in streams) {
      //console.log(session);
      /* send messages to all other streams exept own for this chat */
      const connection = streams[session];

      console.log(data.forum.name);
      if (
        connection.forum == data.forum.name &&
        session != data.user.data.session
      ) {
        /* enqueue messages to all streams for this chat */
        connection.controller.enqueue(JSON.stringify(msg));
      }
    }
  }
}
