<script lang="ts">
  import { onMount } from "svelte";
  import { Confetti } from "svelte-confetti";

  let balance = 0;
  let msg = "";
  let bet = 20;

  let winMulti = 2;
  let jackpotMulti = 5;
  let megaJackpotMulti = 10;
  let confettiAmmount = 700;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    megaJackpotMulti = 100;
    confettiAmmount *= 2;
  }

  let win = false;
  let jackpot = false;

  let one = 7;
  let two = 7;
  let three = 7;

  let playing = false;

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function spin() {
    if (playing == true) return;
    let msgel = document.getElementById("message");
    if (bet < 5) {
      msg = "You must bet at least $5!";
      if (msgel) msgel.style.color = "#ee2c2c";
      bet = 5;
      return;
    }
    playing = true;
    jackpot = false;
    win = false;
    msg = "";
    if (balance < bet) {
      msg = "You don't have enough money! Lower your bet to play.";
      if (msgel) msgel.style.color = "#ee2c2c";
    } else {
      let ms = 0;
      for (let i = 0; i < 20; i++) {
        await sleep(ms);
        ms += 5;
        let minNumber = 0; // inclusive
        let maxNumber = 10; // exclusive
        one = Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
        two = Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
        three = Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
      }
      if (one == two && two == three) {
        if (one == 7) {
          balance += bet * megaJackpotMulti;
          msg = `You won $${bet * megaJackpotMulti}!`;
        } else {
          balance += bet * jackpotMulti;
          msg = "You won $" + bet * jackpotMulti + "!";
        }
        jackpot = true;
        win = true;
        if (msgel) msgel.style.color = "green";
      } else if (one == two || two == three || one == three) {
        balance += bet * winMulti;
        msg = "You won $" + bet * winMulti + "!";
        win = true;
        if (msgel) msgel.style.color = "green";
      } else {
        balance -= bet;
      }
    }
    playing = false;
    updateData();
  }

  async function getData() {
    let sessionID = "";
    const storedSessionID = localStorage.getItem("sessionID");
    if (storedSessionID !== null) sessionID = storedSessionID;
    const response = await fetch("/user", {
      headers: { sessionID: sessionID },
    });
    if (response.status == 403 || response.status == 401) {
      let msg = await response.json();
      // window.location.href = `/?msg=${msg.message}`
    }
    if (response.status != 200) console.log(response.text());
    const data = await response.json();
    balance = data["balance"];
  }

  async function updateData() {
    let sessionID = "";
    const storedSessionID = localStorage.getItem("sessionID");
    if (storedSessionID !== null) sessionID = storedSessionID;
    const myBody = JSON.stringify({
      balance: balance,
      collect: false,
      method: "slots",
    });
    const myHeaders = {
      "Content-Type": "application/json",
      sessionID: sessionID,
    };
    const response = await fetch("/updateuser", {
      method: "POST",
      body: myBody,
      headers: myHeaders,
    });
    if (response.status == 403 || response.status == 401) {
      let msg = await response.json();
      // window.location.href = `/?msg=${msg.message}`
      // myRedirect(`/?msg=${msg.message}`);
    }
    const result = await response.json();
    if (response.status == 403 || response.status == 401)
      // window.location.href = `/?msg=${result.message}`;
      // myRedirect(`/?msg=${result.message}`);
    console.log(result.message);
  }

  onMount(() => {
    getData();
  });
</script>

<title>Slots</title>

{#if jackpot}
  <div
    style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
  >
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[0, 3000]}
      duration={2500}
      amount={confettiAmmount}
      size={25}
      fallDistance="100vh"
    />
  </div>
{/if}

<div id="title" class="m-auto text-center">
  <h1 class="text-[4rem] mb-0">Slot Machine</h1>
</div>

<div class="m-auto w-[50%] h-fit flex flex-row justify-between">
  {#if win}
    <Confetti
      cone
      x={[-1, -2.5]}
      y={[0.25, 0.75]}
      amount={100}
      size={20}
      delay={[0, 1500]}
      fallDistance="100px"
    />
  {/if}
  <div
    id="machine"
    class="rounded-[15px] m-auto dark:bg-(--grey) bg-(--light-grey) w-full h-fit p-[2%] flex flex-row justify-between"
  >
    <div class="box">{one}</div>
    <div class="box">{two}</div>
    <div class="box">{three}</div>
  </div>
  {#if win}
    <Confetti
      cone
      x={[1, 2.5]}
      y={[0.25, 0.75]}
      amount={100}
      size={20}
      delay={[0, 1500]}
      fallDistance="100px"
    />
  {/if}
</div>
<h1 id="message" class="text-center m-auto text-[2rem] h-12">{msg}</h1>
<div id="spindiv" class="w-[50%] h-fit m-auto text-center flex flex-col">
  <button
    on:click={spin}
    aria-label="Spin Button"
    class="m-auto size-28 bg-red-500 transition duration-500 hover:bg-green-500 rounded-full border-0"
  ></button>
  <span class="flex flex-row justify-center text-center w-[50%] m-auto"
    ><p class="text-[2rem] m-2">Spin Price:</p>
    <input
      type="number"
      bind:value={bet}
      class="w-[25%] h-fit p-[1%] text-center bg-(--white) dark:bg-(--black) border-2 border-solid border-(--black) dark:border-(--white) rounded-[10px] text-[1.5rem]"
    />
  </span>
</div>

<h1 id="balance" class="text-center m-auto text-[3rem]">
  Balance = ${balance}
</h1>

<div
  class="bg-(--light-grey) dark:bg-(--grey) size-fit m-auto text-center text-[1.5rem] p-[2%] rounded-[15px]"
>
  Prize Pool <br />
  No Matches: -Spin Price <br />
  2 of a kind: +Spin Price x {winMulti} <br />
  3 of a kind: +Spin Price x {jackpotMulti} <br />
  3 Sevens: +Spin Price x {megaJackpotMulti}
</div>

<style>
  .box {
    padding: 2%;
    border-radius: 15px;
    padding-left: 5%;
    padding-right: 5%;
    font-size: 6rem;
  }
  @media (prefers-color-scheme: dark) {
    .box {
      background-color: var(--black);
    }
  }
  @media (prefers-color-scheme: light) {
    .box {
      background-color: var(--white);
    }
  }
</style>
