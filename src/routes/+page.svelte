<script lang="ts">
	import { onMount } from 'svelte';
	let { data, form } = $props();
	let msg = $state(form?.msg ?? data.msg);
	let color = $state(data.color);
	let usr = $state(data.usr);
	let pass = $state(data.pass);
	let ip = $state('');

	onMount(async () => {
		ip = await fetch('https://api.ipify.org').then((r) => r.text());
	});
</script>

<title>Login</title>

<div
	id="bigdiv"
	class="m-auto mt-[10%] flex size-fit flex-col gap-5 rounded-[10%] bg-[#bbb] p-[5%] text-center shadow-[0_0_50px_15px_#34adfe] dark:bg-[#3c3c3c]"
>
	<h1 class="m-0 text-[3rem]">Login</h1>
	<p class="text-[1.5rem] text-[{color}]" id="msg">{form?.msg ?? msg}</p>
	<form method="post">
		<input name="usr" bind:value={usr} placeholder="Username" />
		<input name="pass" type="password" bind:value={pass} placeholder="Password" />
		<input name="ip" type="hidden" bind:value={ip} />
		<button
			id="submit"
			class="m-auto rounded-[5px] border-2 border-solid border-(--white) bg-[#ccc] p-[3%] text-[1.5rem] text-(--black) hover:shadow-[0_0_10px_5px_#34adfe] dark:bg-[#4c4c4c] dark:text-(--white)"
			>Login</button
		>
	</form>
	<a href="/new?usr={usr}" class="text-[1.5rem]">Or Create a new Account</a>
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
