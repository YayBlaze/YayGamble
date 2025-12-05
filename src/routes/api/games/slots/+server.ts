import { dbQuery } from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { sessionID, bet, megaJackpotMulti } = await request.json();
	const winMulti = 2;
	const jackpotMulti = 5;

	let won = false;
	let diff = 0;

	const res = await dbQuery('SELECT balance FROM users WHERE session_id = ?', [sessionID]);
	if (res.length != 1) throw new Error('more or less than 1 user for this session_id');
	const results = res[0];
	let bal = results.balance;

	const nums = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9 + 1));
	const [one, two, three] = nums;

	let allSame;
	if (new Set(nums).size < 3) {
		allSame = one === two && two === three;
		let newBal = bal + bet * (allSame ? (one === 7 ? megaJackpotMulti : jackpotMulti) : winMulti);
		diff = newBal - bal;
		bal = newBal;
		won = true;
	} else {
		diff = bet;
		won = false;
		bal -= bet;
	}

	await dbQuery('UPDATE users SET balance = ? WHERE session_id = ?', [bal, sessionID]);

	return json({ won, jackpot: allSame, bal, diff, one, two, three });
};
