<script lang="ts">
	import { onMount } from 'svelte';
	let user = 'person';
	let balance = 0;
	let collectBTN = 'Collect $1000';
	let msg = '';
	type LeaderboardItem = {
		username: string;
		balance: number;
	};
	let leaderboard: LeaderboardItem[] = [];
	var dark = false;

	async function getData() {
		let sessionID = '';
		const storedSessionID = localStorage.getItem('sessionID');
		if (storedSessionID !== null) sessionID = storedSessionID;
		let response = await fetch('/user', {
			headers: { sessionID: sessionID }
		});
		if (response.status == 403 || response.status == 401) {
			let msg = await response.json();
			// window.location.href = `/?msg=${msg.message}`;
			// myRedirect(`/?msg=${msg.message}`);
		}
		if (!response.ok) console.log(await response.text());
		let data = await response.json();
		user = data['username'];
		balance = data['balance'];

		response = await fetch('/baltop', {
			headers: { sessionID: sessionID }
		});
		if (response.status == 403 || response.status == 401) {
			let msg = await response.json();
			// window.location.href = `/?msg=${msg.message}`;
			// myRedirect(`/?msg=${msg.message}`);
		}
		if (!response.ok) console.log(await response.text());
		data = await response.json();
		leaderboard = data;

		console.log('requesting data');
		const collectResponse = await fetch('/collecttime', {
			headers: { sessionID: sessionID }
		});
		const collectData = await collectResponse.json();
		if (!collectResponse.ok) console.log(collectData);
		console.log('printing data');
		console.log(collectData);
		if (collectResponse.status == 403 || collectResponse.status == 401) {
			// myRedirect(`/?msg=${collectData.message}`);
		} else {
			if (collectData.cooldown == 0) {
				cooldown = 0;
				collectBTN = 'Collect $1000';
			} else {
				cooldown = collectData.cooldown;
				collectBTN = `Cooldown: ${msToHMS(collectData.cooldown)}`;
			}
		}
	}

	async function updateData() {
		let sessionID = '';
		const storedSessionID = localStorage.getItem('sessionID');
		if (storedSessionID !== null) sessionID = storedSessionID;
		const myBody = JSON.stringify({
			balance: balance,
			collect: true,
			method: 'collect'
		});
		const myHeaders = {
			'Content-Type': 'application/json',
			sessionID: sessionID
		};
		const response = await fetch('/updateuser', {
			method: 'POST',
			body: myBody,
			headers: myHeaders
		});
		if (response.status == 403 || response.status == 401) {
			let msg = await response.json();
			// window.location.href = `/?msg=${msg.message}`;
			// myRedirect(`/?msg=${msg.message}`);
		}
		const result = await response.json();
		if (response.status == 403 || response.status == 401)
			// window.location.href = `/?msg=${result.message}`;
			// myRedirect(`/?msg=${result.message}`);
			console.log(result.message);
	}

	function logout() {
		localStorage.removeItem('sessionID');
		// window.location.href = "/";
		// myRedirect("/");
	}

	function msToHMS(ms: number) {
		let seconds: number = ms / 1000;
		// const hours: number = seconds / 3600;
		// seconds = seconds % 3600;
		const minutes: number = seconds / 60;
		seconds = seconds % 60;
		// return Math.round(hours) + ":" + Math.round(minutes) + ":" + Math.round(seconds);
		return `${Math.round(minutes)}m & ${Math.round(seconds)}s`;
	}

	var cooldown = 0;

	async function collect() {
		let sessionID = '';
		const storedSessionID = localStorage.getItem('sessionID');
		if (storedSessionID !== null) sessionID = storedSessionID;
		let response = await fetch('/collect', {
			headers: { sessionID: sessionID }
		});
		const data = await response.json();
		const msgElem = document.getElementById('msg');
		console.log(response);
		if (response.ok) {
			balance += 1000;
			updateData();
			msg = data.message;
			if (msgElem) msgElem.style.color = 'green';
			cooldown = data.cooldown;
			collectBTN = `Cooldown: ${msToHMS(data.cooldown)}`;
		} else {
			if (response.status == 403 || response.status == 401)
				// window.location.href = `/?msg=${data.message}`;
				// myRedirect(`/?msg=${data.message}`);
				msg = data.message;
			if (msgElem) msgElem.style.color = '#ee2c2c';
			cooldown = data.cooldown;
			collectBTN = `Cooldown: ${msToHMS(data.cooldown)}`;
		}
	}

	function counter() {
		if (cooldown > 0) {
			cooldown -= 1000;
			collectBTN = `Cooldown: ${msToHMS(cooldown)}`;
		} else {
			if (!dark) msg = 'Consider enabling dark mode for a better viewing experience!';
			else msg = '';
			collectBTN = 'Collect $1000';
		}
	}

	setInterval(() => {
		counter();
	}, 1000);

	onMount(() => {
		console.log('getting data');
		getData();
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			dark = true;
			msg = '';
		} else msg = 'Consider enabling dark mode for a better viewing experience!';
	});
</script>

<h1 class="m-auto pt-[2%] text-center text-[3rem]">
	Welcome <strong>{user}</strong>, you currently have
	<strong>${balance}</strong>
</h1>
<title>Home</title>
<div
	id="links"
	class="m-auto flex size-fit flex-col rounded-[15px] bg-[#bbbbbb] p-[2%] text-center text-[1.5rem] dark:bg-[#3c3c3c]"
>
	<a href="/games/slots">Slot Machine</a>
	<a href="/games/blackjack">Blackjack</a>
	<!-- <a href="/games/trivia">Trivia</a> -->
	<!-- <a href="/">4</a> -->
	<button
		type="button"
		class="cursor-pointer border-none bg-transparent text-(--red) hover:underline hover:decoration-(--blue) hover:decoration-wavy"
		on:click={logout}>Logout</button
	>
</div>

<p class="m-auto mt-[3%] size-fit text-center text-[1.5rem]" id="msg">{msg}</p>
<button
	class="border-[2px solid #bbbbbb] m-auto flex size-fit flex-col rounded-[15px] border-2 border-solid border-[#bbbbbb] bg-[#bbbbbb] p-[2%] text-center text-[1.5rem] transition duration-500 hover:bg-[#fbfbfb] dark:border-[#4c4c4c] dark:bg-[#4c4c4c] dark:hover:bg-[#1c1c1c]"
	on:click={collect}
>
	{collectBTN}
</button>

<div class="p-[2%]] m-auto mt-[5%] flex size-fit flex-col text-center text-[1.5rem]">
	<p class="text-[2rem]">Leaderboard</p>
	{#each leaderboard as item, i}
		<p>{i + 1}) {item['username']} = ${item['balance']}</p>
	{/each}
</div>

{#if user === 'admin'}
	<div class="flex flex-col">
		<button
			on:click={() => '/admin'}
			class="border- m-auto mt-[5%] w-[25%] rounded-[15px] bg-[#bbb] text-[2rem] dark:bg-[#4c4c4c]"
			>Admin Dashboard</button
		>
	</div>
{/if}
