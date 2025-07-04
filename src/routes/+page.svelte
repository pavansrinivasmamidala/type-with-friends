<script>
	// @ts-nocheck

	import Icon from 'svelte-awesome';
	import user from 'svelte-awesome/icons/user';
	import users from 'svelte-awesome/icons/users';
	import arrowRight from 'svelte-awesome/icons/arrowRight';
	import { nick, player } from '../lib/store.js';
	import { onDestroy } from 'svelte';
	import { io } from '$lib/realtime';
	import { socketId } from '$lib/store';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	const id = $socketId;
	let nickName = '';
	const playerData = $player;

	function appendNick(data) {
		if (!playerData) {
			io.emit('new-player', {
				nickName: nickName,
				partyLeader: true,
				socketId: id
			});
			io.on('new-player', async (data) => {
				player.update((player) => (player = data));
				console.log('player updated', player);
			});
			goto('/solo');
		}
	}

	onDestroy(unsub);
</script>

<div class="container">
	<div class="nick-div">
		<form on:submit|preventDefault={(data) => appendNick(data)}>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				autofocus
				bind:value={nickName}
				class="nick-input"
				placeholder="Enter name"
			/>
			<!-- <button class="arrow-icon" type="submit">
				<Icon data={arrowRight} scale={1.2} style="color: white;" />
			</button> -->
		</form>
	</div>

	<div class="buttons">
		<div class="icon-button-container">
			<a class="icon-button" href="/solo">
				<Icon data={user} scale={10} style="color:var(--lightTextColor)" />
			</a>
			<span class="icon-under-text">Solo</span>
		</div>
		<div class="icon-button-container">
			<a href="/multiplayer" class="icon-button">
				<Icon data={users} scale={10} style="color:var(--lightTextColor);" />
			</a>
			<span class="icon-under-text">Multiplayer</span>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80%;
		flex-direction: column;
		margin-top: 100px;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 45vw;
		margin-top: 40px;
	}

	.icon-button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.icon-under-text {
		color: var(--darkBackground);
		padding: 15px;
		font-weight: 600;
		font-size: 30px;
		border-radius: 10px;
		text-decoration: none;
		cursor: pointer;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
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
		background-color: white;
		color: var(--darkBackground);
	}

	.nick-input:focus {
		border: 4px solid var(--lightTextColor);
		outline: none;
	}

	.arrow-icon {
		border-radius: 50%;
		background-color: var(--lightTextColor);
		border: 2px solid var(--lightTextColor);
		padding: 10px 12px;
		margin-left: 8px;
		cursor: pointer;
	}

	:global(body.dark-mode) .icon-button {
		background-color: var(--darkBackground);
		border: 3px solid white;
	}
	:global(body.dark-mode) .icon-button:hover {
		background-color: white;
	}
</style>
