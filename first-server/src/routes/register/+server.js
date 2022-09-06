import { error, json } from '@sveltejs/kit';
import { parse } from 'cookie';

import * as database from '$lib/database.js';
import { isJsxSpreadAttribute } from 'typescript';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const req = await request.json();


    const client = await database.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users");  // select users collection

    if (req) {

        // TODO: Dont just create the account. Validate that the user sent proper stuff
        // The user doesnt already exist & passwords are provided.

        let usernameIsAvailiable = false;
        let passwordIsSecure = false;

        if(req.username){
            
            let result = await collection.findOne({"username": req.username});
            if(result == null){
                usernameIsAvailiable = true;
                console.log("usernameIsAvailiable")
            }
              
        } else{
            console.log("Username is empty")
        }
        
        if(req.password){
            if(req.password.length > 4 ){
                console.log("Password is secure")
                passwordIsSecure = true;
            }
        } else {
            console.log("Password is empty");
 
            return json("Password is empty");
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

    // const body = { "register - post": "123" }

    // const cookies = parse(request.headers.get('cookie') || '');

    // console.log(cookies)

    // return json(body);


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request }) {

    const cookies = parse(request.headers.get('cookie') || '');
    console.log(cookies)


    /*     const client = await database.connect();
        const db = client.db("test"); */

    const body = { "register - delete": "123" }


    return json(body);
}
