import type { Collection, ObjectId, SetFields, UpdateResult } from "mongodb";
import { Database } from "./database";

export class User {
  userid: ObjectId;
  data: UserData;

  constructor(userid: ObjectId, data: UserData) {
    this.userid = userid;
    this.data = data;
  }

  // TODO: TodoList /Key value

  static async update(userid: ObjectId, data: UpdateData, remove: boolean) {
    const client = await Database.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection
    //console.log("Update running");
    if (data.todoList) {
      //console.log(data.todoList.text);
      await collection.updateOne(
        { _id: userid, "todoList.text": data.todoList.text },
        { $set: { "todoList.$.status": data.todoList.status } }
      );
    }

    if (remove) {
      await collection.updateOne(
        { _id: userid },
        { $pull: { todoList: { text: data.todoList?.text } } }
      );
    } else {
      await collection.updateOne(
        { _id: userid },
        {
          $addToSet: {
            todoList: data.todoList,
          },
        }
      );
    }
  }

  static async sessionToUserid(session: string): Promise<string | undefined> {
    const client = await Database.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection

    const result = await collection.findOne({ session });
    if (result) return result._id.toString();
  }

  static async read(userid: ObjectId): Promise<User | null> {
    const client = await Database.connect(); // Connect to the mongoDB
    const db = client.db("test"); // select test db
    const collection = db.collection("users"); // select users collection

    const result = await collection.findOne({ _id: userid });

    if (!result) return null;

    const data: UserData = {
      _id: result._id.toString(),
      username: result.username,
      password: result.password,
      salt: result.salt,
      session: result.session,
      todoList: result.todoList || null,
    };
    return new User(userid, data);
  }
}

export type TodoList = {
  text: string;
  status: boolean;
};

export type UpdateData = {
  username?: string;
  password?: string;
  todoList?: TodoList;
};

export type UserData = {
  username: string;
  _id: string;
  password: string;
  salt: string;
  session: string;
  todoList: Array<TodoList>;
};
