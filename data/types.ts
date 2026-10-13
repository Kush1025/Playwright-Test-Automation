export const BOARD_COLUMNS = ['To Do', 'In Progress', 'Done'] as const;
export type BoardColumn = (typeof BOARD_COLUMNS)[number];

export interface Credentials {
  email: string;
  password: string;
}

export interface BoardTestCase {
  id: string;
  project: string;
  task: string;
  column: BoardColumn;
  tags: string[];
  expectedFailure?: string;
}

export interface InvalidLoginCase extends Credentials {
  id: string;
  description: string;
}

export interface TestData {
  boardTests: BoardTestCase[];
  invalidLogins: InvalidLoginCase[];
}
