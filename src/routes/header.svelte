<script>
	// @ts-nocheck

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let routeId;
	page.subscribe((page) => {
		routeId = page.route.id; // get the route parameter 'id'
	});
</script>

<div class="container" style={routeId === '/' ? 'justify-content: center;' : 'justify-content: space-between;'}>
	<div style="display: flex; flex-direction:column;">
		<a class="heading" href="/"> Type with Friends </a>
		<span class="subheading">or anyone</span>
	</div>
	{#if routeId !== '/'}
		<div>
				<button class="btn" tabindex="-1" on:click={() => {
					goto(routeId?.startsWith('/multiplayer') ? '/solo' : '/multiplayer');
				}}>
					{routeId?.startsWith('/multiplayer') ? 'Single Player' : 'Multiplayer'}
				</button>

		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		max-width: 60vw;
		margin: auto;
		padding-top: 20px;
	}

	.heading {
		color: var(--darkBackground);
		padding: 15px;
		font-weight: 600;
		font-size: 40px;
		border-radius: 10px;
		text-decoration: none;
		cursor: pointer;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.subheading {
		color: var(--lightTextColor);
		font-size: 12px;
		position: relative;
		margin-left: 220px;
		margin-top: -20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}
	.btn {
		cursor: pointer;
		border: 2px var(--darkBackground) solid;
		color: var(--lightTextColor);
		background-color: white;
		padding: 10px 20px;
		font-weight: 600;
		font-size: 24px;
		border-radius: 10px;
		opacity: 1;
		text-decoration: none;
		transition: 0.5s ease-in-out;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.btn:hover {
		opacity: 1.5;
		box-shadow: 0 0 0.7rem -0.25rem var(--lightTextColor),
			inset 0 0 1rem -0.75rem var(--lightTextColor);
	}

	.monkeytype {
		display: flex;
		text-decoration: none;
		justify-content: space-between;
		font-size: bold;
		color: var(--darkBackground);
	}

	:global(body.dark-mode) .heading {
		color: white;
	}
	:global(body.dark-mode) .btn {
		color: white;
		background-color: var(--darkBackground);
		border: var(--lightTextColor) 1px solid;
		opacity: 1;
	}
</style>
