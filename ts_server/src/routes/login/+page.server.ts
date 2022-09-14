import type { Actions } from './$types';


export const actions: Actions = {
    login: async ({ request, locals, cookies }) => {
        const form = await request.formData();

        cookies.set('userid', 'secret', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV == 'production',
            maxAge: 120
        })
    },
};
