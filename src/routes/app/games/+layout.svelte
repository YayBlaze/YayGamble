<script>
  let { children } = $props();

  function logout() {
    localStorage.removeItem("sessionID");
    // window.location.href = "/";
    // REDIRECT TO /
  }
</script>

<nav
  class="bg-(--light-grey) dark:bg-(--grey) rounded-2xl p-4 flex flex-row w-[75%] m-auto text-[1.5rem] justify-between"
>
  <span class="w-[40%] flex flex-row justify-between">
    <a href="/home"> Home </a>
    <a href="/games/blackjack">Blackjack</a>
    <a href="/games/slots">Slots</a>
  </span>
  <div class="w-[50%]"></div>
  <button
    type="button"
    class="w-[10%] text-(--red) bg-transparent border-none cursor-pointer hover:underline hover:decoration-wavy hover:decoration-(--red)"
    onclick={logout}>Logout</button
  >
</nav>

{@render children()}

<style>
  a:hover {
    color: var(-white);
  }
</style>
