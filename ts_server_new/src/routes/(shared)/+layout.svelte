<script lang="ts">
  import type { LayoutServerData } from "./$types";
  export let data: LayoutServerData;
</script>

<nav style="margin: 20px auto">
  {#if data?.user}
    <a href="/">Home</a>
    <a href="/settings">Settings</a>
  {:else}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}

  <a href="/info">Info</a>
  <a href="/support">Support</a>

  {#if data?.user}
    <a href="/todo">Todo</a>
  {/if}
</nav>

<slot />
