import type {
  Auth,
  DeleteResult,
  Encrypter,
  LoginResult,
  RegisterResult,
  SignoutResult,
  UIDRandomizer,
} from "$lib/interfaces/auth";
import { database } from "$lib/ssr";
import { redirect } from "@sveltejs/kit";
import * as crypto from "crypto";
import { compile } from "mdsvex";
import { Code } from "mongodb";

export class AdvancedUIDRandomizer implements UIDRandomizer {
  generate_unique_id(): string {
    return crypto.randomUUID();
  }
}

export class AdvancedEncrypter implements Encrypter {
  hash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
  }
}

export class SQLiteAuth implements Auth {
  async delete(username: string): Promise<DeleteResult> {
    const result = await database.user.delete({
      where: { username },
    });

    if (!result) {
      return {
        error: { code: 400, data: "Delete Account Failed" },
        success: false,
      };
    } else {
      return { success: true };
    }
  }

  async signout(username: string): Promise<SignoutResult> {
    if (username) {
      try {
        const result = await database.user.update({
          where: { username },
          data: {
            session: crypto.randomUUID(),
          },
        });
        return { success: true };
      } catch (e) {
        return { error: { code: 400, data: e }, success: false };
      }
    }
    return {
      error: { code: 400, data: "Something wong" },
      success: false,
    };
  }
  async register(form: FormData): Promise<RegisterResult> {
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username) {
      return { error: { code: 400, data: { username: "username missing" } } };
    }
    if (!password) {
      return {
        error: { code: 400, data: { password: "password missing" } },
      };
    }

    try {
      const result = await database.user.findFirst({
        where: { username },
        select: { username: true },
      });

      if (result) {
        return {
          error: { code: 400, data: { username: "username already exsists" } },
        };
      }

      if (password.toString().length < 4) {
        return {
          error: {
            code: 400,
            data: { username: "password must be at least 5 chars long" },
          },
        };
      }

      let salt = crypto.randomBytes(16).toString("hex");

      // Hash the salt and password with 1000 iterations, 64 length and sha512 digest
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

      const session = crypto.randomUUID();

      const result2 = await database.user.create({
        data: {
          username,
          salt,
          hash,
          session,
          todos: {},
        },
      });
      return { success: { user: result2 } };
    } catch (e) {
      console.log(e);
      return {
        error: {
          code: 400,
          data: { server: "database connection error" },
        },
      };
    }
  }
  randomizer: UIDRandomizer = new AdvancedUIDRandomizer();
  encrypter: Encrypter = new AdvancedEncrypter();

  async login(form: FormData): Promise<LoginResult> {
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username) {
      return { error: { code: 400, data: { username: "username missing" } } };
    }

    if (!password) {
      return { error: { code: 400, data: { password: "password missing" } } };
    }

    try {
      const result = await database.user.findFirst({
        where: { username },
      });

      console.log(result);

      if (!result) {
        return {
          error: {
            code: 400,
            data: { user: "wrong credentials" },
          },
        };
      }

      const { salt, hash } = result;

      const newhash = this.encrypter.hash(password, salt);

      if (newhash != hash) {
        return {
          error: {
            code: 400,
            data: { user: "wrong credentials" },
          },
        };
      }

      const session = this.randomizer.generate_unique_id();

      const update = await database.user.update({
        where: { id: result.id },
        data: {
          session,
        },
      });

      return { success: { user: update } };
    } catch (e) {
      console.log(e);
      return {
        error: {
          code: 400,
          data: { server: "database connection error" },
        },
      };
    }
  }
}
