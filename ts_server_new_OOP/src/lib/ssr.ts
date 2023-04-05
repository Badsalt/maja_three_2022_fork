import { PrismaClient } from "@prisma/client";
export const database = new PrismaClient();

export let streams: Record<
  string,
  { controller: ReadableStreamDefaultController; forum: string }
>;

export function init_ssr() {
  streams = {};
}
