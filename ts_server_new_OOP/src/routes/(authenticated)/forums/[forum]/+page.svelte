<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
  $: messages = [...data.forum.messages].reverse();

  if (browser) {
    const ac = new AbortController();
    const signal = ac.signal;

    async function stream() {
      try {
        /* GET request to +server.ts */
        const response = await fetch("/forums/" + $page.params.forum, {
          signal,
        });

        /* get the reader for events */
        const reader = response.body
          ?.pipeThrough(new TextDecoderStream())
          .getReader();

        while (reader) {
          /* read stuff indefinitely */
          const { value, done } = await reader.read();

          if (done) break;

          const message = JSON.parse(value);

          /* add the new message */
          if (message) {
            message.timestamp = new Date(message.timestamp.toString());
            messages = [message, ...messages];
          }
        }
        ac.abort();
      } catch (e) {
        console.log(e + " error stream closure");
      }
    }

    stream();

    onDestroy(() => {
      ac.abort();
    });
  }
</script>

<img src="" alt="" />
<h1>{data.forum.name}</h1>
<span>{data.forum.Owner.username}</span>
<div>
  <div class="forum-container">
    {#each messages as message}
      <div class="message-card-container">
        <div style="display: flex; flex-direction: row;">
          <div
            class={message.authorId == data.user?.id
              ? "author-container own"
              : "author-container"}
          >
            <span>{message.author.username}</span>
          </div>
          <div
            style="margin-left: auto; display:flex; flex-direction: column; padding: 5px"
          >
            <span>{@html message.content}</span>
            <i>
              <span
                >{message.timestamp.toDateString()} at {message.timestamp
                  .toTimeString()
                  .split(" ")[0]}</span
              >
            </i>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div style="display:flex; flex-direction:column">
    <form use:enhance action="?/write" method="post" style="margin-top: 10px">
      <textarea
        required
        name="message"
        placeholder="message"
        cols="20"
        rows="10"
        style="resize: vertical"
      />
      <button type="submit">Write message</button>
    </form>
  </div>
</div>

<style>
  .forum-container {
    width: 90vw;
    height: 50vh;
    margin: 0 10px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    overflow-y: scroll;
    padding: 20px 0;
  }
  .message-card-container {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    width: 95%;
    border: black solid 1px;
    margin: 5px auto;
  }
  .message-card-container span {
    display: inline-block;
    padding: 5px;
  }
  img {
    max-width: 50%;
    border-radius: 10px;
  }

  .author-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20%;
    height: 100%;
    background-color: lightgrey;
    text-align: center;
    border-left: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .own {
    background-color: #d0b8a8;
  }

  h1 {
    color: red;
  }
</style>
