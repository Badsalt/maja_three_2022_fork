import type { Actions } from './$types';



export const actions: Actions = {
	register: async ({ request, locals }) => {
		const form = await request.formData();


	},
};
