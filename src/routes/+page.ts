export async function load({ params, url }) {
	let user = '';
	let password = '';
	let msg = '';
	let color = '#ee2c2c';

	let searchParams = url.searchParams;
	msg = searchParams.get('msg') ?? msg;
	color = searchParams.get('color') ?? color;
	user = searchParams.get('user') ?? user;
	password = searchParams.get('pass') ?? password;
	return { msg, color, user, password };
}