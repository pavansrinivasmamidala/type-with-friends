<script>
	// @ts-nocheck

	import moon from './icons/moon.png';
	import sun from './icons/sun.png';

	let checked = false;
	function toggle() {
		checked
			? window.document.body.classList.remove('dark-mode')
			: window.document.body.classList.add('dark-mode');
		checked = !checked;
	}
</script>

<div class="toggle-div">
	<input type="checkbox" id="switch" bind:checked on:click={toggle} />
	<label for="switch">
		<img src={sun} alt="sun" height="20px" id="sun" />
		<img src={moon} alt="moon" height="20px" id="moon" />
		<span class="ball" />
	</label>
</div>

<style>
	label {
		display: flex;
		width: 35px;
		height: 25px;
		justify-content: space-between;
		align-items: center;
		padding: 0 6px;
		background: white;
		border: 1px solid var(--lightTextColor);
		border-radius: 50px;
		cursor: pointer;
		position: relative;
	}

	#switch {
		display: none;
	}

	label img {
		height: 14px;
	}

	label #moon {
		transition: 0.5s;
		opacity: 1;
	}

	label #sun {
		opacity: 0;
		transition: 0.5s;
	}
	label .ball {
		display: none;
	}

	input:checked + label #sun {
		opacity: 1;
	}
	input:checked + label #moon {
		opacity: 0;
	}

	input:checked + label {
		background-color: var(--darkBackground);
	}

	label .ball {
		position: absolute;
		display: block;
		width: 15px;
		height: 15px;
		top: 5px;
		left: 5px;
		background: var(--lightTextColor);
		border-radius: 50%;
		transition: 0.5s;
		opacity: 0.7;
	}

	input:checked + label .ball {
		transform: translateX(20px);
	}
</style>
