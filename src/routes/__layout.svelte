<script>
	import Header from '$lib/header/header.svelte';
	import Footer from '$lib/footer/footer.svelte';
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


	:global(body.dark-mode)  {
		color: white;
	}

	:global(body.dark-mode) {
		background-color: #212b43;
	}
</style>
