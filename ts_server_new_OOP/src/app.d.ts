// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from "$lib/user";

// and what to do when importing types
declare global {
  declare namespace App {
    // what data should pass to the user in locals
    interface Locals {
      username: string;
      user: User | null;
      session: string | null;
    }

    // interface PageData {}

    // interface Error {}

    // interface Platform {}
  }
}
