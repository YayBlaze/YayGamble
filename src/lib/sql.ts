import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '$env/static/private';
import mysql from 'mysql2/promise';

const con: mysql.Connection = await mysql.createConnection({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME
});

export async function sqlRequest(sql: string, args?: any[]): Promise<any> {
	try {
		const [res, fields] = await con.query(sql, args);
		return res;
	} catch (err: any) {
		throw new Error(err);
	}
}

export async function login(usr: string, pass: string) {
	try {
		let auth = false;
		let validUsr = false;
		let results: any[] = await sqlRequest('SELECT password FROM users WHERE username = ?', [usr]);
		if (!results || results.length == 0) return { auth, validUsr };
		else validUsr = true;
		const hashed: string = await hash(pass);
		const correct = results[0];
		if (correct == hashed) auth = true;
		return { auth, validUsr };
	} catch (err: any) {
		throw new Error(err);
	}
}

export async function hash(input: string): Promise<string> {
	const data = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
