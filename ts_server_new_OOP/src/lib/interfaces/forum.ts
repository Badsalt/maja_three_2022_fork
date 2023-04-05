/**
 * Contains Functionallity for forumPage and forum Slug
 */

import type { User } from "$lib/user";
import type { Forum } from "@prisma/client";

export type AddForumRequest = {
  userID: number;
  name: string;
};

export type WriteMessageRequest = {
  forum: Forum;
  message: string;
  user: User;
};

export interface ForumController {
  add(data: AddForumRequest): Promise<void>;
  /**Returns All forums */
  load(): Promise<Forum[]>; //Return all forums

  /**
   *
   * @param name slug
   */
  /**
   * Returns one Forum contains Messages
   */
  loadOneForum(name: string): Promise<Forum>; //Return one Forum contains Messages ets

  writeMessage(data: WriteMessageRequest): Promise<void>; // Write a Message

  getStream(session: string, forum: string): ReadableStream<string>;
}
