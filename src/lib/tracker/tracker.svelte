
<script>

let players = ['Player 1', 'Player 2', 'Player 3'];
let move = 0;
</script>

<div>
    {#each players as player}
        <div class="tracker">
            <span class="player-name">{player}</span>
            <p class="ball" style={`transform: translateX(${move}%);`} />
            <p class="line" />
        </div>
    {/each}
</div>


<style>
    .line {
		background-color: var(--darkBackground);
		width: 50vw;
		height: 3px;
		border-radius: 4px;
		margin-bottom: 25px;
	}

	.ball {
		background-color: var(--darkBackground);
		box-shadow: 0 0 0.2rem 0.025rem var(--lightTextColor),
			inset 0 0 1rem -0.75rem var(--lightTextColor);
		height: 15px;
		width: 15px;
		border-radius: 100%;
		transform: translateX(20px);
		margin-bottom: -26px;
		transition: ease-in-out all 0.5s;
	}

	:global(body.dark-mode) .line {
		background-color: var(--lightTextColor);
	}

	:global(body.dark-mode) .ball {
		background-color: var(--lightTextColor);
		box-shadow: none;
	}
</style>