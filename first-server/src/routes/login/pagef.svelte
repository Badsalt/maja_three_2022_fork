<script>
    /** @type {import('./$types').PageServerData} */
    export let data;

    /**
     * @type {import('./$types').Errors}
     */
    export let errors;
</script>

<h1>Login page</h1>

<h2>Login status: {data?.registered}</h2>

<form method="POST">
    <input type="text" name="username" id="" />
    <input type="password" name="password" />
    <button>SIGN IN</button>
</form>
<form method="DELETE">
    <button>LOG OUT</button>
</form>

{#if errors?.message}
    <span class="error_text">{errors?.message}</span>
{/if}

{#if data.userLoggedIn}
    <h1>User logged in: {data.user}</h1>
{/if}

<style>
    .error_text {
        color: red;
        font-weight: bolder;
    }
</style>
