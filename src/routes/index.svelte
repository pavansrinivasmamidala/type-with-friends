<script>
	import Game from "./game.svelte";
</script>

<Game />


<style>
	:global(:root){
		--lightTextColor:#62cfe6;
		--lightBackground: white;
		--darkTextColor:#5ed9f2;
		--darkBackground:#03070f;
	}
	:global(body) {
		transition: 0.5s ease-in-out;
	}
</style>