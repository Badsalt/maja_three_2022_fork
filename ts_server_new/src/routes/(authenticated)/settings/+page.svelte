<script lang="ts">
	import type { ActionData } from ".svelte-kit/types/src/routes/(unauthenticated)/register/$types";

	export let form: ActionData;
</script>

<form method="POST" action="?/logout">
	<button>LOGOUT</button>
</form>

<form method="POST" action="?/deleteaccount">
	<button>DELETE ACCOUNT</button>
	{#if form?.message}
		{form.message}
	{/if}
</form>
