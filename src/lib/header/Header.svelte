<script>
</script>

<div class="container">
	<div style="display: flex; flex-direction:column;">
		<a class="heading" href="/"> Type with Friends </a>
		<span class="subheading">or anyone</span>
	</div>

	<div>
		<a
			class="btn"
			tabindex="-1"
			href="/multiplayer"
		>
			Multiplayer</a
		>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 60vw;
		margin: auto;
		padding-top: 20px;
	}

	.heading {
		color: var(--darkBackground);
		padding: 15px;
		font-weight: 600;
		font-size: 35px;
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
		opacity: 0.6;
        text-decoration:none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.btn:hover {
		opacity: 1.5;
		box-shadow: 0 0 0.5rem -0.25rem var(--lightTextColor),
			inset 0 0 0.1rem -0.75rem var(--lightTextColor);
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

	:global(body.dark-mode) .container {
		background-color: var(--darkBackground);
	}
</style>
