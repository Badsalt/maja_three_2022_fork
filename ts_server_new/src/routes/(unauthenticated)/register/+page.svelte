<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  const d = new Date();

  const text = d.toISOString();

  console.log(text);

  export let form: ActionData;
</script>

<form use:enhance method="POST" action="?/register">
  <input type="text" name="username" />
  <input type="passowrd" name="password" />
  <button>REGISTER</button>
  {#if form?.message}
    <p>{form?.message}</p>
  {/if}
</form>
