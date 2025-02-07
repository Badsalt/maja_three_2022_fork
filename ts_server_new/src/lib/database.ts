import { redirect } from "@sveltejs/kit";
import * as crypto from "crypto";

import { PrismaClient, type Session, type User } from "@prisma/client";
// const prisma = new PrismaClient();

export class Database {
  static databaseConnection: PrismaClient;

  static async connect() {
    if (!this.databaseConnection) {
      this.databaseConnection = new PrismaClient();
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
    const client = await this.connect(); // Connect to sqLite

    if (username) {
      const result = await client.user.findFirst({
        where: { username },
        select: { username: true },
      });

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

    let result = await client.user.create({
      data: {
        username,
        salt,
        password: hash,
        todos: {},
      },
    });

    if (result) {
      throw redirect(302, "/");
    } else {
      return "The server failed to procces the reg, plase try again later";
    }
  }

  static async delete(userid: number): Promise<string> {
    const client = await this.connect(); // Connect to sqlite

    const result = await client.user.delete({
      where: {
        id: userid,
      },
    });

    if (!result) {
      return "Delete Account Failed";
    } else {
      return "Delete Account success";
    }
  }

  //TODO: Update function for user object

  //TODO: get user object
  static async getUserData(userid: number) {
    const client = await this.connect(); // Connect to the mongoDB

    const result = await client.user.findUnique({
      where: {
        id: userid,
      },
    });

    // const result = await collection.findOne({ _id: userid });

    if (!result) return false;

    return result;
  }

  //TODO: login
  static async login(
    username: string,
    password: string
  ): Promise<User | false> {
    const client = await this.connect(); // Connect to the mongoDB
    // const db = client.db("test"); // select test db
    // const collection = db.collection("user"); // select user collection
    // const result = await collection.findOne({
    //   username: username,
    // });

    const result = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (!result) return false;
    // const session = await client.session.findFirst({
    //   where: {
    //     id: result.id,
    //   },
    // });
    // Get the unique salt for a particular user
    const salt = result.salt;

    // Hash the salt and password with 1000 iterations, 64 length and sha512 digest
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (result.password == hash) {
      const session = crypto.randomUUID();

      await client.user.update({
        where: {
          id: result.id,
        },
        data: {
          session,
        },
      });

      //const dateISO = d.toISOString();

      // client.session.create({
      //   data: {
      //     exprire_at: d,
      //     value: crypto.randomUUID(),
      //     ownerId: result.id,
      //   },
      // });

      result.session = session;
      return result;
    } else {
      return false;
    }
  }
}
