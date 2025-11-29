import { updateIPs } from '$lib';
import { login, sqlRequest } from '$lib/sql';
import { fail, type Actions } from '@sveltejs/kit';
import { v7 as uuid } from 'uuid';
import type { PageServerLoad } from './app/admin/$types';
import { goto } from '$app/navigation';

export const load: PageServerLoad = ({ url }) => {
	let searchParams = url.searchParams;
	let msg = searchParams.get('msg') ?? '';
	let color = searchParams.get('color') ?? '#ee2c2c';
	let usr = searchParams.get('usr') ?? '';
	return { msg, color, usr, pass: '' };
};

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const usr = data.get('usr');
		const pass = data.get('pass');
		if (!usr) return fail(400, { auth: false, msg: 'Please provide a username', usr: usr });
		if (!pass) return fail(400, { auth: false, msg: 'Please provide a password', usr: usr });
		const { auth, validUsr } = await login(usr.toString(), pass.toString());
		if (auth) {
			const res = await sqlRequest('SELECT id FROM users WHERE username = ?', [usr]);
			const results = res[0];
			const ip = data.get('ip')?.toString();
			if (ip) updateIPs(results.id, ip);
			const sessionID = uuid();
			const sessionExpire = Date.now() + (24 * 60 * 60 * 1000)
			cookies.set('session', sessionID, { path: '/' });
			await sqlRequest('UPDATE users SET session_id = ?, session_expire = ? WHERE id = ?', [sessionID, sessionExpire, results.id])
			goto('/app/home');
		} else if (validUsr) {
			return fail(401, { auth, msg: 'Incorrect Password', usr: usr });
		} else {
			return fail(401, { auth, msg: 'Username not found', usr: usr });
		}
	}
} satisfies Actions;
