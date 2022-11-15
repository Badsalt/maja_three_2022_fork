import { prisma, type Todo } from "@prisma/client";
import { Database } from "./database";

export class User {
  userid: number;
  data: UserData;

  constructor(userid: number, data: UserData) {
    this.userid = userid;
    this.data = data;
  }

  // TODO: TodoList /Key value

  static async update(userid: number, data: UpdateData, remove: boolean) {
    const client = await Database.connect(); // Connect to sqllite

    //console.log("Update running");'
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

  static async sessionToUserid(session: string): Promise<number | undefined> {
    const client = await Database.connect(); // Connect to sqlite

    const result = await client.user.findFirst({
      where: {
        session,
      },
    });
    if (result) return result.id;
  }

  static async read(userid: number): Promise<User | null> {
    const client = await Database.connect(); // Connect to the mongoDB

    const result = await client.user.findUnique({
      where: {
        id: userid,
      },
      include: {
        todos: true,
      },
    });
    console.log(result?.todos);
    if (result) return new User(userid, result);
    return null;
  }
}

export type TodoList = {
  text: string;
  status: boolean;
  id: number;
};

export type UpdateData = {
  username?: string;
  password?: string;
  todoList?: TodoList;
};

export type UserData = {
  username: string;
  id: number;
  password: string;
  salt: string;
  session: string;
  todos: Todo[];
};
