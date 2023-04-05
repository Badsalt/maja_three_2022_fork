/**
 * Contains Functionality for Todo Page.
 */

export type TodoUpdateRequest = {
  username: string;
  id: number;
  status: boolean;
};

export type TodoCreateRequest = {
  username: string;
  text: string;
  status: boolean;
};

export type TodoRemoveRequest = {
  id: number;
};

export interface Todo {
  update(data: TodoUpdateRequest): Promise<void>;
  create(data: TodoCreateRequest): Promise<void>;
  remove(data: TodoRemoveRequest): Promise<void>;
}
