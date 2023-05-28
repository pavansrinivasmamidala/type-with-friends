<script>
	import Header from '../lib/header/header.svelte';
	import Footer from '../lib/footer/footer.svelte';
</script>

<header>
	<Header />
</header>

<main>
	<slot />
</main>

<footer>
	<Footer />
</footer>

<style>
	main {
		max-width: 80vw;
		margin: auto;
		height: 80vh;
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
