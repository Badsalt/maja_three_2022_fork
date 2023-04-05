<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<div class="loginContainer">
  <form class="loginform" use:enhance method="POST" action="?/register">
    <h1>Register</h1>
    <input type="text" name="username" />
    <input type="password" autocomplete="on" name="password" />
    <button type="submit">Register</button>
    {#if form?.data.username}
      <p>{form.data.username}</p>
    {/if}
    {#if form?.data.password}
      <p>{form.data.password}</p>
    {/if}
    {#if form?.data.user}
      <p>{form.data.user}</p>
    {/if}
  </form>
</div>

<style>
  .loginContainer {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-content: center;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }

  .loginform {
    display: flex;
    flex-direction: column;
    width: 50vw;
    height: 25wh;
    background-color: lightgrey;
    padding: 20px;
    border-radius: 20px;
    align-items: center;
  }

  .loginform input {
    padding: 10px;
    margin: 10px;
    width: 50%;
  }

  .loginform button {
    padding: 10px;
    width: 75%;
  }
</style>
