<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<!-- <input bind:value={} type="text" placeholder="new todo item.." /> -->
<form use:enhance={(e) => e.form.reset()} action="?/create" method="post">
  <input type="text" name="newTodo" placeholder="Add new Todo" required />
  <button type="submit">Add</button>
</form>
{#if data?.user && data?.user?.todos.length > 0}
  <ol>
    {#each data.user.todos as item, index}
      <item style="display: flex;">
        <form use:enhance action="?/update" method="post" id="updateStatus">
          <input
            type="text"
            name="status"
            hidden
            value={JSON.stringify({
              status: !item.status,
              text: item.text,
              id: item.id,
            })}
          />
          <button class="test" class:checked={item.status} type="submit">
            {#if item.status}
              <i class="fa fa-check-square-o" />
            {:else}
              <i class="fa fa-square-o" />
            {/if}
          </button>
        </form>
        <span class:checked={item.status}>{item.text}</span>
        <form
          use:enhance={(e) => e.form.reset()}
          action="?/remove"
          method="post"
        >
          <input
            type="text"
            name="removeTodoID"
            hidden
            placeholder="Remove Todo"
            value={item.id}
          />

          <button
            style="background: none; border: none; cursor: pointer ;"
            type="submit">❌</button
          >
        </form>
      </item>
      <br />
    {/each}
  </ol>
{:else}
  <h1>You have No todos Yeee</h1>
{/if}

<br />

<style>
  .checked {
    text-decoration: line-through;
  }

  .test {
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
