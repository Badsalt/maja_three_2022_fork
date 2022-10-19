import { redirect } from "@sveltejs/kit";
import { MongoClient, ObjectId } from "mongodb";
import * as crypto from "crypto";
import type { UserData } from "./user";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export class Database {
  static databaseConnection: MongoClient;

  static async connect() {
    if (!this.databaseConnection) {
      this.databaseConnection = await MongoClient.connect(
        "mongodb://localhost:27017/"
      );
      // console.log("First Time"); //mongodb://
    } else {
      // console.log("Reused Time");
    }
    //console.log(this.databaseConnection)
    return this.databaseConnection;
  }

  static async register(
    username: string | undefined,
    password: string | undefined
  ): Promise<string | undefined> {
    const client = await this.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection

    if (username) {
      //   const result = await client.users.findUnique({
      //     where: { username },
      //     select: { username: true },
      //   });

      const result = await collection.findOne({ username: username });

      if (result) {
        return "Username alredy exsists";
      }
    } else {
      return "Username can not be empty";
    }
    if (password) {
      if (password.toString().length < 4) {
        return "Password must be at least 5 chars long";
      }
    } else {
      return "password can not be empty";
    }

    //if no error has been thrown run this
    // Creating a unique salt for a particular user
    let salt = crypto.randomBytes(16).toString("hex");

    // Hash the salt and password with 1000 iterations, 64 length and sha512 digest
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    // let result = await client.users.create({
    //   data: {
    //     username,
    //     salt,
    //     password,
    //     todoList: [],
    //   },
    // });

    const result = await collection.insertOne({
      username,
      salt,
      password: hash,
      todoList: [],
    });
    if (result.acknowledged) {
      //TOOD: Set cookie

      throw redirect(302, "/");
    } else {
      return "The server failed to procces the reg, plase try again later";
    }
  }

  static async delete(userid: ObjectId): Promise<string | undefined> {
    const client = await this.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection

    const result = await collection.deleteOne({ _id: userid });

    // const result = await client.users.delete({
    //   where: {
    //     id: userid.toString(),
    //   },
    // });

    if (!result) {
      return "Delete Account Failed";
    } else {
      return "Delete Account success";
    }
  }

  //TODO: Update function for user object

  //TODO: get user object
  static async getUserData(userid: ObjectId) {
    const client = await this.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection

    // const result = await client.users.findUnique({
    //   where: {
    //     id: userid.toString(),
    //   },
    // });

    const result = await collection.findOne({ _id: userid });

    if (!result) return false;

    return result;
  }

  //TODO: login
  static async login(
    username: string,
    password: string
  ): Promise<UserData | false> {
    const client = await this.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection
    const result = await collection.findOne({
      username: username,
    });

    if (!result) return false;

    const data: UserData = {
      _id: result._id.toString(),
      username: result.username,
      password: result.password,
      salt: result.salt,
      session: result.session,
      todoList: result.todoList,
    };

    // Get the unique salt for a particular user
    const salt = data.salt;

    // Hash the salt and password with 1000 iterations, 64 length and sha512 digest
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    //console.log(hash);
    //console.log(data.password == hash);

    if (data.password == hash) {
      const session = crypto.randomUUID();

      const update = await collection.updateOne(
        { username },
        {
          $set: {
            session,
          },
        }
      );
      data.session = session;
      return data;
    } else {
      return false;
    }
  }
}
