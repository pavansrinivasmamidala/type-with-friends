<script>
	// @ts-nocheck

	import Icon from 'svelte-awesome';
	import user from 'svelte-awesome/icons/user';
	import users from 'svelte-awesome/icons/users';
	import arrowRight from 'svelte-awesome/icons/arrowRight';
	import { nick, player } from '../lib/store.js';
	import { onDestroy } from 'svelte';
	import { io } from '$lib/realtime';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	let nickName = '';
	let test = '';

	export function load() {
		throw redirect(301, '/solo');
	}
	const unsub = nick.subscribe((value) => {
		test = value;
		nickName = value;
	});

	function appendNick() {
		nick.update((nick) => (nick = nickName));
		// io.emit('new-player',{
		// 	nickName: nickName,
		// 	partyLeader: true
		// })
		// io.on('new-player',async (data) => {
		// 	player.update((player) => player = data);
		// 	console.log('player updated' + player);
		// })
		goto('/solo');
	}

	onDestroy(unsub);
</script>

<div class="container">
	<div class="nick-div">
		<form on:submit|preventDefault={() => appendNick()}>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				autofocus
				disabled={test}
				bind:value={nickName}
				class="nick-input"
				placeholder="Enter nick name"
			/><button class="arrow-icon" on:click={() => appendNick()}>
				<Icon data={arrowRight} scale={1.2} style="color: white;" />
			</button>
		</form>
	</div>
	<!-- {#if test}
		<div class="buttons">
			<a class="icon-button" href="/solo">
				<Icon data={user} scale={10} style="color:var(--lightTextColor)" />
			</a>

			<a href="/multiplayer" class="icon-button">
				<Icon data={users} scale={10} style="color:var(--lightTextColor);" />
			</a>
		</div>
	{/if} -->
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
