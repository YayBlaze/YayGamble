import { sqlRequest } from '$lib/sql';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, cookies }) => {
	let auth = false;
	let isAdmin = false;
    const sessionID = cookies.get("session")

    const res = await sqlRequest("SELECT session_expire, is_admin FROM users WHERE session_id = ?", [sessionID])
    

	return json({ auth, isAdmin });
};
