export function load({ cookies }) {
	const visited = cookies.get('session');

	return {
		visited
	};
}