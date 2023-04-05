import type { Forum, Message, Todo } from "@prisma/client";
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
      //update status of TOOD
      await client.user.update({
        where: {
          id: userid,
        },
        data: {
          todos: {
            update: {
              where: {
                id: data.todoList.id,
              },
              data: {
                status: data.todoList.status,
              },
            },
          },
        },
      });

      if (remove) {
        await client.todo.delete({
          where: {
            id: data.todoList.id,
          },
        });
      }
    }
  }

  static async create(userid: number, text: string) {
    const client = await Database.connect(); // Connect to sqllite

    await client.todo.create({
      data: {
        status: false,
        ownerId: userid,
        text,
      },
    });
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
        messages: true,
        forums: true,
      },
    });
    //console.log(result?.todos);
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
  session: string | null;
  todos: Todo[];
  forums: Forum[];
  messages: Message[];
};
