import { sqlRequest, login } from '$lib/sql';
import { updateIPs } from '$lib/index';
import { json, type RequestHandler } from '@sveltejs/kit';
import { v7 as uuid } from 'uuid';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { usr, pass, ip } = await request.json();
	const { auth, validUsr } = await login(usr, pass);
	if (auth) {
		const results = await sqlRequest('SELECT id, is_admin FROM users WHERE username = ?', [usr]);
		updateIPs(results[0], ip);
		const isAdmin = results[1];
		const sessionID = uuid();
		cookies.set('session', sessionID, { path: '/' });
		return json({ auth, isAdmin, sessionID });
	} else if (validUsr) {
		return json({ auth, msg: 'Incorrect Password' });
	} else {
		return json({ auth, msg: 'Username not found' });
	}
};
