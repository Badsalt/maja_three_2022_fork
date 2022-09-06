<<<<<<< HEAD
<script>
    /** @type {import('./$types').PageServerData} */
    export let data;

    /**
     * @type {import('./$types').Errors}
     */
    export let errors;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<p>
    {data.number}
</p>

<form method="POST">

    <input type="text" name="" id="">
    <input type="password">


    {#if errors?.test}
        <p>{errors.test}</p>
    {/if}
    <button>CLICK ME</button>
    {#if errors?.password}
        <p>{errors.password}</p>
    {/if}
</form>
=======
<script>
    /** @type {import('./$types').PageServerData} */
    export let data;

    /**
     * @type {import('./$types').Errors}
     */
    export let errors;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<p>
    {data.number}
</p>

<form method="POST">
    <button>CLICK ME</button>
    {#if errors?.password}
        <p>{errors.password}</p>
    {/if}
</form>
>>>>>>> e7a92fe1669e3170ab812fc46b6edbcb826d5542
