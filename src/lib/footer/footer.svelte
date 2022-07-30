<script>
	// @ts-nocheck
	import code from 'svelte-awesome/icons/code';
	import twitter from 'svelte-awesome/icons/twitter';
	import telegram from 'svelte-awesome/icons/telegram';
	import Icon from 'svelte-awesome';

    function toggle() {
	window.document.body.classList.toggle('dark-mode')
}
</script>

<div class="container">
	<div>
		<a href="https://github.com/pavansrinivasmamidala/type-with-friends" target="_blank">
			<button class="btn">
				<Icon data={telegram} scale="1" />
				<span>Contact</span>
			</button></a
		>
		<a href="https://github.com/pavansrinivasmamidala/type-with-friends" target="_blank">
			<button class="btn">
				<Icon data={code} scale="1" />
				<span>Github</span></button
			></a
		>

		<a href="https://twitter.com/pavan_mamidala" target="_blank">
			<button class="btn">
				<Icon data={twitter} scale="1" />
				<span>Twitter</span>
			</button></a
		>
	</div>
	<div>
		<button on:click={toggle} tabindex="-1">toggle</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		margin: auto;
		max-width: 55vw;
		justify-content: space-between;
	}

	.btn {
		background-color: white;
		color: #62cfe6;
		border: none;
		font-size: 16px;
		cursor: pointer;
		align-items: center;
	}

    span{
        margin-left: 5px;
    }
</style>
