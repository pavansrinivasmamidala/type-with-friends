<script>
	// @ts-nocheck
	import code from 'svelte-awesome/icons/code';
	import twitter from 'svelte-awesome/icons/twitter';
	import telegram from 'svelte-awesome/icons/telegram';
	import Icon from 'svelte-awesome';
	import Toggle from '$lib/toggle.svelte';
</script>

<div class="container">
	<div>
		<!-- <a
			href="https://github.com/pavansrinivasmamidala/type-with-friends"
			target="_blank"
			class="btn"
		>
			<Icon data={telegram} scale="0.9" />
			<span >Contact</span>
		</a> -->
		<a
			href="https://github.com/pavansrinivasmamidala/type-with-friends"
			target="_blank"
			class="btn"
		>
			<Icon data={code} scale="1.4" style="color:var(--darkBackground); margin-right:4px;" />
			<span>Github</span></a
		>

		<!-- <a href="https://twitter.com/pavan_mamidala" target="_blank" class="btn">
			<Icon data={twitter} scale="1" />
			<span>Twitter</span>
		</a> -->
	</div>

	<Toggle />
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		margin: auto;
		max-width: 55vw;
		justify-content: space-between;
		position: fixed;
		bottom: 40px;
		left: 0;
		right: 0;
	}

	.btn {
		text-decoration: none;
		color: var(--lightTextColor);
		border: none;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin-right: 15px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	:global(body.dark-mode) .btn {
		color: var(--lightTextColor);
	}

	span {
		margin-left: 5px;
	}
</style>
