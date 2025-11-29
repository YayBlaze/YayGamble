import { goto } from "$app/navigation";
import { sqlRequest } from "$lib/sql";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionID = cookies.get('session');
	const res = await sqlRequest('SELECT session_expire, is_admin FROM users WHERE session_id = ?', [
		sessionID
	]);
	if (res.length <= 0) goto('/?msg=Invalid Session - Log in again')
	const response = res[0]
	if (response.session_expire < Date.now()) goto('/?msg=Session Expired - Log in again')
	if (response.is_admin) return { isAdmin: true}
	else return { isAdmin: false };
};
