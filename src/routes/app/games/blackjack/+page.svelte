<script lang="ts">
  import { onMount } from "svelte";
  var balance = 0;
  var bet = 100;
  var lockedbet = 100;
  var msg = "";
  var playing = false;

  var dealer = "Start a new game!";
  var player = "Start a new game!";
  var dealerValue = 0;
  var playerValue = 0;

  var dealerCards: string[] = [];
  var playerCards: string[] = [];

  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  var cards: string[] = [];
  function newDeck() {
    cards = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push(`${rank}${suit}`);
      }
    }
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function getCardValue(card: string) {
    const rank = card.slice(0, card.length - 1);
    if (rank == "?") return 0;
    if (rank === "A") return 11;
    if (["K", "Q", "J"].includes(rank)) return 10;
    return parseInt(rank, 10);
  }

  function fixAce() {
    for (let i = 0; i < playerCards.length; i++) {
      if (playerCards[i].startsWith("A")) {
        if (playerValue > 21) {
          playerValue -= 10;
        }
      }
    }
    for (let i = 0; i < dealerCards.length; i++) {
      if (dealerCards[i].startsWith("A")) {
        if (dealerValue > 21) {
          dealerValue -= 10;
        }
      }
    }
  }

  function start() {
    if (playing) {
      msg = "You are currently playing a game!";
      const msgElem = document.getElementById("msg");
      if (msgElem) msgElem.style.color = "#ee2c2c";
      return;
    } else if (balance < bet) {
      msg = "You don't have enough money! Lower your bet to play.";
      const msgElem = document.getElementById("msg");
      if (msgElem) msgElem.style.color = "#ee2c2c";
      return;
    } else if (bet < 100) {
      msg = "You must bet at least $100!";
      const msgElm = document.getElementById("msg");
      if (msgElm) msgElm.style.color = "#ee2c2c";
      bet = 100;
      return;
    }
    lockedbet = bet;
    balance -= lockedbet;
    playing = true;
    msg = "";
    newDeck();
    playerCards = [];
    dealerCards = [];
    for (let i = 0; i < 2; i++) {
      playerCards.push(
        cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
      );
    }
    dealerCards.push(
      cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
    );
    dealerCards.push("??");
    calcValues();
    calcWin(false);
  }

  function calcValues() {
    playerValue = 0;
    dealerValue = 0;
    player = "";
    dealer = "";
    for (let i = 0; i < playerCards.length; i++) {
      let value = getCardValue(playerCards[i]);
      playerValue += value;
      player += playerCards[i] + " ";
    }
    for (let i = 0; i < dealerCards.length; i++) {
      let value = getCardValue(dealerCards[i]);
      dealerValue += value;
      dealer += dealerCards[i] + " ";
    }
    fixAce();
  }

  function calcWin(stand: boolean) {
    if (playerValue > 21) lose("Bust");
    else if (dealerValue == 21 && dealerCards.length == 2)
      lose("Dealer Blackjack");
    else if (playerValue == 21 && dealerCards.length == 2) win("Blackjack");
    else if (playerValue == 21 && dealerValue == 21) push();
    else if (stand) {
      if (dealerValue == playerValue) push();
      else if (dealerValue > 21) win("Dealer Bust");
      else if (dealerValue > playerValue) lose("Closest to 21");
      else if (playerValue > dealerValue) win("Closest to 21");
      else lose("this shouldn't even happen but you lose ig");
    }
  }

  function hit() {
    if (!playing) {
      const msgElem = document.getElementById("msg");
      if (msgElem) msgElem.style.color = "#ee2c2c";
      msg = "You need to start a new game first!";
      return;
    }
    playerCards.push(
      cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
    );
    calcValues();
    if (playerValue == 21) stand();
    calcWin(false);
  }

  function stand() {
    if (!playing) {
      const msgElem = document.getElementById("msg");
      if (msgElem) msgElem.style.color = "#ee2c2c";
      msg = "You need to start a new game first!";
      return;
    }
    dealerCards.splice(dealerCards.indexOf("??"), 2);
    while (dealerValue < 17) {
      dealerCards.push(
        cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
      );
      calcValues();
      calcWin(false);
    }
    calcWin(true);
  }

  function win(winMsg: string) {
    calcValues();
    balance += lockedbet * 2;
    msg = "You Win: " + winMsg;
    const msgElem = document.getElementById("msg");
    if (msgElem) msgElem.style.color = "green";
    playing = false;
    updateData();
  }

  function lose(loseMsg: string) {
    calcValues();
    msg = "Dealer Wins: " + loseMsg;
    const msgElm = document.getElementById("msg");
    if (msgElm) msgElm.style.color = "#ee2c2c";
    playing = false;
    updateData();
  }

  function push() {
    msg = "Push: Money back";
    const msgElm = document.getElementById("msg");
    if (msgElm) msgElm.style.color = "#ffb347";
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
      // myRedirect(`/?msg=${msg.message}`);
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
      method: "blackjack",
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
  }

  onMount(() => {
    getData();
  });
</script>

<title>Slots</title>

<div class="m-auto text-center">
  <h1 class="text-[4rem] mb-0">Blackjack</h1>
</div>

<h1 class="text-center m-auto text-[3rem]">Balance = ${balance}</h1>
<h1 class="text-center m-auto text-[2rem]" id="msg">{msg}</h1>

<div
  id="play-area"
  class="bg-(--light-grey) dark:bg-(--grey) text-center rounded-[15px] w-[50%] h-fit m-auto p-[2%] grid grid-cols-2"
>
  <p class="text-[3rem]">Player Cards</p>
  <p class="text-[3rem]">Dealer Cards</p>
  <p>{player}</p>
  <p>{dealer}</p>
  <p>{playerValue}</p>
  <p>{dealerValue}</p>
</div>
<div
  class="text-center text-[1.5rem] m-auto mt-[2%] bg-(--light-grey) dark:bg-(--grey) w-[50%] h-fit p-[1%] rounded-[15px]"
>
  Cards Left: {cards.length} | Bet:
  <input
    type="number"
    bind:value={bet}
    class="w-[20%] p-[1%] m-auto text-center bg-(--white) dark:bg-(--black) border-2 border-solid border-(--black) dark:border-(--white) rounded-[5px] text-[1.5rem]"
  />
</div>
<div class="text-center w-[50%] h-fit m-auto p-[2%] flex justify-between">
  <button
    class="bg-green-500 p-[2%] w-[20%] text-(--black) rounded-[5px] text-[1.5rem] hover:bg-(--white) dark:hover:bg-(--black) transition duration-500 hover:text-green-500 border-2 border-solid border-green-500"
    on:click={hit}>Hit</button
  >
  <button
    on:click={start}
    class="bg-yellow-500 p-[2%] w-[30%] text-(--black) rounded-[5px] text-[1.5rem] hover:bg-(--white) dark:hover:bg-(--black) transition duration-500 hover:text-yellow-500 border-2 border-solid border-yellow-500"
    >New Game</button
  >
  <button
    class="bg-red-500 p-[2%] w-[20%] text-(--black) rounded-[5px] text-[1.5rem] hover:bg-(--white) dark:hover:bg-(--black) transition duration-500 hover:text-red-500 border-2 border-solid border-red-500"
    on:click={stand}>Stand</button
  >
</div>

<style>
  #play-area > p {
    font-size: 1.5rem;
  }
</style>
