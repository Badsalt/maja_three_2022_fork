import type { User } from "@prisma/client";

/**
 * Result either contains an error object or a session if successfully authenticated.
 */
export type LoginResult =
  | { error: { code: number; data: any }; success?: undefined }
  | { error?: undefined; success: { user: User } };

export type RegisterResult =
  | { error: { code: number; data: any }; success?: undefined }
  | { error?: undefined; success: { user: User } };

export type SignoutResult =
  | { error: { code: number; data: any }; success: false }
  | { error?: undefined; success: true };

export type DeleteResult =
  | { error: { code: number; data: any }; success: false }
  | { error?: undefined; success: true };

/**
 * Contains authentication functionality such as registration, login, signout, etc.
 */
export interface Auth {
  randomizer: UIDRandomizer;
  encrypter: Encrypter;
  /**
   * Authenticates the user and returns a session token or an error object with proper HTTP code.
   * @param form the authentication data submitted by a user. Should include 'username' and 'password'
   */
  login(form: FormData): Promise<LoginResult>;
  /**
   * Register the user and returns a session token or an error object with proper HTTP code.
   * @param form the authentication data submitted by a user. Should include 'username' and 'password'
   */
  register(form: FormData): Promise<RegisterResult>;
  /**
   * Signout the user and returns sucess or an error object with proper HTTP code.
   * @param form the authentication data submitted by a user. Should include 'username'
   */
  signout(username: string): Promise<SignoutResult>;
  /**
   * Delete the user and returns sucess or an error object with proper HTTP code.
   * @param form the authentication data submitted by a user. Should include 'username'
   */
  delete(username: string): Promise<DeleteResult>;
}

export interface UIDRandomizer {
  generate_unique_id(): string;
}

export interface Encrypter {
  hash(password: string, salt: string): string;
}
