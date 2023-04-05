<script lang="ts">
  import type { LayoutServerData } from "./$types";
  export let data: LayoutServerData;
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<nav style="margin: 20px auto">
  <a href="/">Home</a>
  <a href="/settings">Settings</a>
  <a href="/info">Info</a>
  <a href="/support">Support</a>
  <a href="/todo">Todo</a>

  <a href="/forums">Forums</a>
</nav>

<slot />
