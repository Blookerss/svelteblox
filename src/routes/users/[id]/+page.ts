import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../$types';
export const load = (async ({ params }) => {
	throw redirect(304, `/users/${params.id}/profile`);
}) satisfies PageLoad