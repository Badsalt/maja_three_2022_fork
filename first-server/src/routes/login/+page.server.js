import { error, json } from '@sveltejs/kit';
import { parse } from 'cookie';
import { serialize } from 'cookie';
import * as database from '$lib/database.js';
import { isJsxSpreadAttribute } from 'typescript';

let registered = "";
let userLoggedIn = false;
let user = ""
let userToken = {
    id: "secret"
}


/** @type {import('./$types').PageServerLoad} */
export function load() {
    return {
        registered,
        userLoggedIn,
        user

    };
}


/** @type {import('./$types').Action} */
export async function POST({ request, setHeaders }) {
    const req = await request.formData();

    const username = req.get("username")
    const password = req.get("password")

    const client = await database.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users");  // select users collection


    // Check if password and username has been sent
    // else throw error with text describing whats wrong

    // Does the username already exist?

    // Is the password too simple?



    if (req) {

        // TODO: Dont just create the account. Validate that the user sent proper stuff
        // The user doesnt already exist & passwords are provided.



        if (username) {

            let result = await collection.findOne({ "username": username });
            if (!result) {
                registered = "Failed";
                return {
                    errors: {
                        message: "Username not exsist"
                    }
                }
            } else {
                //Username exsist
                user = username.toString();
            }

        } else {
            registered = "Failed";
            return {
                errors: {
                    message: "Username is empty"
                }
            }
        }


        if (password) {
            let result = await collection.findOne({ "username": username, "password": password })
            if (result) {
                console.log("login - POST : 123")
                setHeaders({
                    'set-cookie': serialize('token', userToken.id, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 120 // two minutes
                    })
                });

                registered = "Success";
                userLoggedIn = true;
            }
        } else {
            registered = "Failed";
            return {
                errors: {
                    message: "Password is empty"
                }
            }
        }


    } else {
        registered = "Failed";
        return {
            errors: {
                message: "Something when wrong please try again"
            }
        }
    }

    //BUG: To be able to use langauge server VS Code
    return {
        errors: {}
    }

}


/** @type {import('./$types').Action} */
export async function DELETE({ setHeaders }) {
    console.log("login - delete : 123")

    /*     const client = await database.connect();
        const db = client.db("test"); */

    const body = { "register - delete": "123" }

    // does a cookie exist for the user id?
    // in other words, is the user signed in?

    // delete account connected to the session cookie.

    setHeaders({
        'set-cookie': serialize('token', "", {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0 // one minute
        })
    });


}