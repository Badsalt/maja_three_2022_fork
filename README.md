# Cheat sheet TypeScript

## `Typer i TypeScript`

```ts
let x_str: string = "hello";
let x_float: number = 20.5;
let x_int: number = 5;
let x_list: Array<number> = [1, 2, 3, 4];
let x_dict: { name: string; age: number } = { name: "bart", age: 13 };
let x_true: boolean = true;
```

<div style="page-break-after: always;"></div>

## `Funktioner i Typescript`

```ts
// funktionen tar inga "argument"
// funktionen returnerar inga värden
function example(): void {
  console.log("pancakes");
}

// samma funktionsbeskrivning som lambda
const example: () => void = () => console.log("pancakes");

// anropa funktionen
example();
example();
example();

// funktionen tar inga "argument"
// funktionen returnerar ett värde
function example(): string {
  return "Chocolate";
}

//anropa funktionen
let temp = example();
temp = temp + example();
temp = temp + "Rainbow";
console.log(temp);

// Funktion med parametrar och returvärde
function addition(first: string, second: string): string {
  return first + second;
}

console.log(addition("hej", "kompis"));
```

# `SvelteKit`

[Deras docs är AMAZING!](https://kit.svelte.dev/docs/introduction)

## `Viktiga länkar`

- [Projektstruktur](https://kit.svelte.dev/docs/project-structure)
- [Routing](https://kit.svelte.dev/docs/routing)
  - [+page.svelte](https://kit.svelte.dev/docs/routing#page-page-svelte)
  - [+layout.svelte](https://kit.svelte.dev/docs/routing#layout-layout-svelte)
  - [Layout Groups](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts-group)
- [Loadfunktioner](https://kit.svelte.dev/docs/load)
  - [Output](https://kit.svelte.dev/docs/load#output)
  - [Errors](https://kit.svelte.dev/docs/load#errors)
  - [Redirects](https://kit.svelte.dev/docs/load#redirects)
- [Form Actions](https://kit.svelte.dev/docs/form-actions)
- [Hooks](https://kit.svelte.dev/docs/hooks#server-hooks)

## `Hooks`

```ts
/* hooks.server.ts */

import type { Handle } from "@sveltejs/kit";

// handle runs for every request to the server
export const handle: Handle = async ({ event, resolve }) => {
  // retrieve userid from cookies
  let userid = event.cookies.get("userid");

  if (userid) {
    // save to locals which makes it accessible
    // in server-only load functions, and +server.ts files.
    event.locals.userid = userid;
  }

  return resolve(event);
};
```

## `Locals`

```ts
/* app.d.ts */

// Define the interface of the data to be passed as locals between
// server hook and server-only load functions.
interface Locals {
  userid: string;
}
```

## `Layout Server Load`

```ts
/* +layout.server.ts */

import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// define the load function, which runs before fetching the layout and page
// for all pages under the current layout group
export const load: LayoutServerLoad = async ({ locals, cookies }) => {


    if (locals.userid) {
        // pass userid as LayoutServerData to +layout.svelte
        return {
            userid: locals.userid,
        }
    } else
        // redirect user to login route if locals object contain'nt userid
        throw redirect(302, '/login')
    }

}

```

## `Layout`

```ts
/* +layout.svelte */

// load data from load function in +layout.server.ts
<script lang="ts">
    import type { LayoutServerData } from "./$types";
    export let data: LayoutServerData;
</script>

// show a nav bar for all pages in the current layout group
<nav>
    {#if data?.userid}
        <a href="/">Home</a>
        <a href="/settings">Settings</a>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}

    <a href="/info">Info</a>
    <a href="/support">Support</a>
</nav>

// the +page.svelte is placed into the slot
<slot />

```

## `Page Server Load`

```ts
/* +page.server.ts */
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// load
export const load: PageServerLoad = async ({ locals }) => {
  if (locals.userid) {
    throw redirect(302, "/");
  }
};
```

## `Page`

```html
<!-- +page.svelte -->

<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  // Data returned from load function
  export let data: PageData;

  // Data returned from Actions
  export let form: ActionData;
</script>

<!-- POST method for login action in +page.server.ts -->
<form method="POST" action="?/login">
  <input type="text" name="username" />
  <input type="passowrd" name="password" />
  <button>LOGIN</button>
  {#if form?.message}
  <p>{form?.message}</p>
  {/if}
</form>
```

## `Actions`

```ts
/* +page.server.ts */

import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import * as database from "$lib/database";

export const actions: Actions = {
  login: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    // TODO: Implement login
    // Check if password and username
    // exists and is correct

    if (form.get("username") == "william") {
      // pass {message:string} to form: ActionData in +page.svelte
      return fail(400, { message: "username invalid" });
    }

    // Set userid cookie with key userid, value secret, available for all pages below root route, exist for 120 seconds.
    cookies.set("userid", "secret", {
      path: "/",
      httpOnly: true, // optional for now
      sameSite: "strict", // optional for now
      secure: process.env.NODE_ENV === "production", // optional for now
      maxAge: 120, //
    });

    // redirect user to root route on successful login
    throw redirect(302, "/");
  },
};
```

## `Database`

```ts
/* $lib/database.ts */
import { MongoClient } from "mongodb";

export async function connect(): Promise<MongoClient> {
  return await MongoClient.connect("mongodb://localhost:27017/");
}
```

```ts
/* login action in +page.server.ts */

const client = await database.connect(); // Connect to the mongoDB
const db = client.db("test"); // select test db
const collection = db.collection("users"); // select users collection

const result = await collection.findOne({ username, password });
```
