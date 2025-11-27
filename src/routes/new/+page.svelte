<script lang="ts">
	let user = $state('');
	let password = $state('');
	let msg = $state('');

	async function login() {
		msg = 'Loading...';
		if (user.includes(' ') || password.includes(' ')) {
			msg = 'Please do not include spaces in your username or password.';
			return;
		} else if (user.length < 4 || user.length > 15) {
			msg = 'Your username must be 4-15 characters long';
			return;
		} else if (password.length < 4 || user.length > 15) {
			msg = 'Your password must be 4-15 characters long';
			return;
		}
		const res = await fetch('/api/adduser', {
			method: 'POST',
			body: JSON.stringify({
				usr: user,
				pass: password,
				ip: await fetch('https://api.ipify.org').then((res) => res.text())
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await res.json()
    if (data.success) {

    } else if (data.taken) {

    }
    else msg = "Internal Server Error"
	}
</script>

<title>New Account</title>

<div
	id="bigdiv"
	class="m-auto mt-[10%] flex size-fit flex-col gap-5 rounded-[10%] bg-[#3c3c3c] p-[5%] text-center shadow-[0_0_50px_15px_#34adfe]"
>
	<h1 class="m-0 text-[3rem]">Create an Account</h1>
	<p class="text-[1.5rem] text-[#ee2c2c]">{msg}</p>
	<input type="text" bind:value={user} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button
		id="submit"
		onclick={login}
		class="m-auto rounded-[5px] border-2 border-solid border-(--white) bg-[#4c4c4c] p-[3%] text-[1.5rem] text-(--white) hover:shadow-[0_0_10px_5px_#34adfe]"
		>Create Account</button
	>
	<a href="/" class="text-[1.5rem]">Or Log in</a>
</div>

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
