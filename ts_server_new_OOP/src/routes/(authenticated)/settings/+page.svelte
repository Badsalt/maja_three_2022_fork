<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<form method="POST" use:enhance action="?/logout">
  <button>LOGOUT</button>
  {#if form}
    {form}
  {/if}
</form>

<form method="POST" action="?/deleteaccount">
  <button>DELETE ACCOUNT</button>
  {#if form?.data}
    {form.data}
  {/if}
</form>
