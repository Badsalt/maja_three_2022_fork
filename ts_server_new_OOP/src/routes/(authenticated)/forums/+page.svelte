<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

# Forums Page

<form action="?/add" method="post" use:enhance={(e) => e.form.reset()}>
  <input type="text" required name="form-name" id="" />
  <button type="submit">Test</button>
</form>

<hr />

{#each data.forums as forum}
  <a style="margin:auto 10px" href="/forums/{forum.name}">{forum.name}</a>
{/each}
<hr />
