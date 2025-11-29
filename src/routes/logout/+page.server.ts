import { goto } from '$app/navigation';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = ({ cookies }) => {
	cookies.delete('session', { path: '/' });
    goto('/')
};