<script>
    /** @type {import('./$types').PageServerData} */
    export let data;

    /**
     * @type any
     */
    export let errors;
</script>

<h1>Registration page</h1>

<h2>Registration status: {data?.registered}</h2>

<form method="POST">
    <input type="text" name="username" id="" />
    <input type="password" name="password" />
    <button>SIGN UP</button>
</form>

{#if errors?.message}
    <span class="error_text">{errors?.message}</span>
{/if}

<style>
    .error_text {
        color: red;
        font-weight: bolder;
    }
</style>
