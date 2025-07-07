<script>
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import ConnectionStatus from '$lib/ConnectionStatus.svelte';
	import { page } from '$app/stores';
</script>

<header>
	<Header />
</header>

<main class="card">
	{#key $page.url.pathname}
	<slot />
	{/key}
</main>

<footer>
	<Footer />
</footer>

<style>
	main {
		max-width: 80vw;
		margin: auto;
		height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	:global(body.dark-mode) {
		color: white;
	}
	:global(body) {
		transition: all ease-in-out 0.5s;
	}

	:global(body.dark-mode) {
		background-color: var(--darkBackground);
	}
	:global(:root) {
		--lightTextColor: #62cfe6;
		--lightBackground: white;
		--darkTextColor: #5ed9f2;
		--darkBackground: #03070f;
	}
</style>
