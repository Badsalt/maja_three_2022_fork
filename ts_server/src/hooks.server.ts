import type { Handle } from '@sveltejs/kit';

//Handle runs for evert request to the server
export const handle: Handle = async ({ event, resolve }) => {
	let userid = event.cookies.get('userid');

	if (userid) {
		event.locals.userid = userid;
	}

	return resolve(event);
};
