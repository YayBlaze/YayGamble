<script lang="ts">
	import { onMount } from 'svelte';
	let { msg: _msg, color: _color, usr: _usr, pass: _pass } = $props();
	let msg = $state(_msg);
	let color = $state(_color);
	let usr = $state(_usr);
	let pass = $state(_pass);

	onMount(() => {
		const msgElem = document.getElementById('msg');
		if (msgElem) msgElem.style.color = color;
	});

	async function login() {
		msg = 'Loading...';
		const res = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				usr: usr,
				pass: pass,
				ip: await fetch('https://api.ipify.org').then((res) => res.text())
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await res.json();
		if (data.auth) {
			color = '#32CD32';
			msg = 'Correct! Redirecting...';
			let sessionID = data.sessionID
			
		} else {
			color = '#ee2c2c';
			msg = data.msg;
		}
	}
</script>

<title>Login</title>

<div
	id="bigdiv"
	class="m-auto mt-[10%] flex size-fit flex-col gap-5 rounded-[10%] bg-[#bbb] p-[5%] text-center shadow-[0_0_50px_15px_#34adfe] dark:bg-[#3c3c3c]"
>
	<h1 class="m-0 text-[3rem]">Login</h1>
	<p class="text-[1.5rem]" id="msg">{msg}</p>
	<input type="text" bind:value={usr} placeholder="Username" />
	<input type="password" bind:value={pass} placeholder="Password" />
	<button
		id="submit"
		onclick={login}
		class="m-auto rounded-[5px] border-2 border-solid border-(--white) bg-[#ccc] p-[3%] text-[1.5rem] text-(--black) hover:shadow-[0_0_10px_5px_#34adfe] dark:bg-[#4c4c4c] dark:text-(--white)"
		>Login</button
	>
	<a href="/new" class="text-[1.5rem]">Or Create a new Account</a>
</div>

<h1 class="mt-[5%] text-center text-[1.5rem]">
	Welcome to my site! <br />Please create an account of your're new.
</h1>

<style>
	input {
		background-color: #4c4c4c;
		color: white;
		border: 2px solid white;
		border-radius: 5px;
		padding: 2%;
		margin: auto;
	}
	input:hover {
		box-shadow: 0 0 10px 5px #34adfe;
	}
</style>
