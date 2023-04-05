import type { ForumController } from "$lib/interfaces/forum";
import { forumPage } from "./implementations/forum";

export const forumController: ForumController = new forumPage();
