import { sqlRequest } from "./sql";

export async function updateIPs(id: string, ip: string): Promise<void> {
    try {
        const results = await sqlRequest('SELECT ip FROM ips WHERE id = ?', [id]);
        if (ip == '137.83.106.214' || ip in results) return;
        const usr = (await sqlRequest('SELECT username FROM users WHERE id = ?', [id]))[0];
        await sqlRequest('INSERT INTO ips (id, username, ip) VALUES (?, ?, ?)', [id, usr, ip]);
    } catch (err: any) {
        throw new Error(err);
    }
}