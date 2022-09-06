import { error, json } from '@sveltejs/kit';
import { parse } from 'cookie';

import * as database from '$lib/database.js';
import { isJsxSpreadAttribute } from 'typescript';

let registered = false;

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



    registered = true;

    if (req) {

        // TODO: Dont just create the account. Validate that the user sent proper stuff
        // The user doesnt already exist & passwords are provided.

        let usernameIsAvailiable = false;
        let passwordIsSecure = false;

        if(username){
            
            let result = await collection.findOne({"username": username});
            if(!result){
                usernameIsAvailiable = true;
                console.log("usernameIsAvailiable")
            } else {
                console.log("usernameIsNotAvailiable")
            }
              
        } else{
            console.log("Username is empty")
        }
        
        if(password){
            if ( password && password.toString().length > 4 ){
                console.log("Password is secure")
                passwordIsSecure = true;
            }
        } else {
            console.log("Password is empty");
 
        }
        
        if(passwordIsSecure && usernameIsAvailiable){
            collection.insertOne(req);
            throw error(202, "USER ADDED TO DATABASE")
        } else {
            throw error(406, "USER NOT ADDED TO DATABASE")
             
        }
                   
    } else {
        throw error(404);
    }

}
    

/** @type {import('./$types').Action} */
export async function DELETE({ request }) {

    const cookies = parse(request.headers.get('cookie') || '');
    console.log(cookies)


    /*     const client = await database.connect();
        const db = client.db("test"); */

    const body = { "register - delete": "123" }

    // does a cookie exist for the user id?
    // in other words, is the user signed in?

    // delete account connected to the session cookie.


}
