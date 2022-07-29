<script>
	// @ts-nocheck
	import code from 'svelte-awesome/icons/code';
    import twitter from 'svelte-awesome/icons/twitter';
    import telegram from 'svelte-awesome/icons/telegram';
	import Icon from 'svelte-awesome';
</script>

<div class="container">

    <a href="https://github.com/pavansrinivasmamidala/type-with-friends" target="_blank">
		<button class="btn"> <Icon data={telegram} scale="1.2" /> Contact</button></a
	>
	<a href="https://github.com/pavansrinivasmamidala/type-with-friends" target="_blank">
		<button class="btn"> <Icon data={code} scale="1.2" /> Github</button></a
	>

    <a href="https://twitter.com/pavan_mamidala" target="_blank">
		<button class="btn"> <Icon data={twitter} scale="1.2" /> Twitter</button></a
	>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		margin: auto;
        max-width: 55vw;
        justify-content: space-evenly;
	}

	.btn {
		background-color: white;
		color: #62cfe6;
		border: none;
		font-size: 20px;
        cursor: pointer;
	}
</style>
