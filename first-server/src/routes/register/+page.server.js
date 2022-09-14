import { error, json } from '@sveltejs/kit';
import { parse } from 'cookie';

import * as database from '$lib/database.js';
import { isJsxSpreadAttribute } from 'typescript';

let registered = "";

/** @type {import('./$types').PageServerLoad} */
export function load() {
    return {
        registered
    };
}


/** @type {import('./$types').Action} */
export async function POST({ request }) {
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
    let user = await collection.findOne({ password })

    if (user) {
        return {
            errors: {
                message: "password already taken by username: " + user.username
            }
        }
    }


    if (req) {

        // TODO: Dont just create the account. Validate that the user sent proper stuff
        // The user doesnt already exist & passwords are provided.

        if (username) {

            let result = await collection.findOne({ "username": username });
            if (result) {
                registered = "Failed";
                return {
                    errors: {
                        message: "Username already exsist"
                    }
                }

            } else {
                //console.log("USername is avaavaas")
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
            if (password && password.toString().length > 4) {
                //console.log("Password is secure")
            } else {
                registered = "Failed";
                return {
                    errors: {
                        message: "Password must be at least 5 chars long"
                    }
                }
            }
        } else {
            registered = "Failed";
            return {
                errors: {
                    message: "Password cannot be empty"
                }
            }
        }

        //if no error has been thrown run this
        registered = "Pending";
        let result = await collection.insertOne({ "username": username, "password": password });
        if (result.acknowledged) {
            registered = "Success";

        } else {
            registered = "Failed";
            return {
                errors: {
                    message: "Something failed, please try again"
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
export async function DELETE({ request }) {

    const cookies = parse(request.headers.get('cookie') || '');
    //console.log(cookies)


    /*     const client = await database.connect();
        const db = client.db("test"); */

    const body = { "register - delete": "123" }

    // does a cookie exist for the user id?
    // in other words, is the user signed in?

    // delete account connected to the session cookie.


}
