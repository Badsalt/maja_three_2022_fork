<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<form use:enhance method="POST" action="?/login">
  <input type="text" name="username" />
  <input type="passowrd" name="password" />
  <button>LOGIN</button>
  {#if form?.message}
    <p>{form?.message}</p>
  {/if}
</form>
