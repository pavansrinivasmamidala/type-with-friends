<script>
	import Header from '../lib/header/header.svelte'
</script>

<header>
<Header />
</header>


<main >
	<slot />
</main>

<style>
	main{
		max-width: 80vw;
		margin: auto;
		height: 80vh;
	}
</style>