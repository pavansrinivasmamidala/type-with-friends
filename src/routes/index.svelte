<script>
	import Icon from 'svelte-awesome';
	import user from 'svelte-awesome/icons/user';
	import users from 'svelte-awesome/icons/users';
	import arrowRight from 'svelte-awesome/icons/arrowRight';
	let nick = '';
</script>

<div class="container">
	<div class="nick-div">
		<input type="text" bind:value={nick} class="nick-input" placeholder="Enter nick name" />
		<Icon
			data={arrowRight}
			scale={1.2}
			style="
		color: white;
		border-radius: 50%;
		background-color: var(--lightTextColor);
		border: 2px solid var(--lightTextColor);
		padding:10px 12px;
		margin-left:8px;
		cursor:pointer;
		"
		/>
	</div>
	{#if nick}
		<div class="buttons">
			<a class="icon-button" href="/solo">
				<Icon data={user} scale={10} style="color:var(--lightTextColor)" />
			</a>

			<a href="/multiplayer" class="icon-button">
				<Icon data={users} scale={10} style="color:var(--lightTextColor);" />
			</a>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80%;
		flex-direction: column;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 45vw;
		margin-top: 40px;
	}
	.icon-button {
		background-color: white;
		border: 3px solid var(--darkBackground);
		border-radius: 20px;
		height: 25vh;
		width: 20vw;
		cursor: pointer;
		transition: all ease-in-out 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-button:hover {
		background-color: var(--darkBackground);
	}

	.nick-div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nick-input {
		height: 50px;
		font-size: 28px;
		border: 3px solid var(--darkBackground);
		border-radius: 7px;
		padding-left: 8px;
		width: 30vw;
	}

	.nick-input:focus {
		border: 4px solid var(--lightTextColor);
		outline: none;
	}

	.arrow-icon {
		color: var(--lightTextColor);
		border-radius: 100%;
		border: 2px solid var(--lightTextColor);
	}

	.btn {
		padding: 8px 12px;
		border-radius: 8px;
		background: none;
		color: var(--lightTextColor);
		box-shadow: 0 0 0.3rem -0.25rem var(--lightTextColor),
			inset 0 0 0.5rem -0.75rem var(--lightTextColor);
		cursor: pointer;
		border: 2px var(--darkBackground) solid;
		font-size: 22px;
	}

	:global(body.dark-mode) .icon-button {
		background-color: var(--darkBackground);
		border: 3px solid white;
	}
	:global(body.dark-mode) .icon-button:hover {
		background-color: white;
	}
</style>
