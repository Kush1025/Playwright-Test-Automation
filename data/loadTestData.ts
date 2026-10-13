import rawData from './testCases.json';
import { BOARD_COLUMNS, type TestData } from './types';

function assertUniqueIds(ids: string[], section: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate id "${id}" in testCases.json → ${section}`);
    seen.add(id);
  }
}

function validate(data: TestData): TestData {
  assertUniqueIds(
    data.boardTests.map((t) => t.id),
    'boardTests',
  );
  assertUniqueIds(
    data.invalidLogins.map((t) => t.id),
    'invalidLogins',
  );

  for (const tc of data.boardTests) {
    if (!BOARD_COLUMNS.includes(tc.column)) {
      throw new Error(`${tc.id}: unknown column "${tc.column}". Expected one of: ${BOARD_COLUMNS.join(', ')}`);
    }
    if (!tc.project || !tc.task) throw new Error(`${tc.id}: "project" and "task" are required`);
    if (!Array.isArray(tc.tags) || tc.tags.length === 0) throw new Error(`${tc.id}: "tags" must be a non-empty array`);
    if (tc.expectedFailure !== undefined && (typeof tc.expectedFailure !== 'string' || !tc.expectedFailure.trim())) {
      throw new Error(`${tc.id}: "expectedFailure" must be a non-empty reason`);
    }
  }
  for (const tc of data.invalidLogins) {
    if (typeof tc.email !== 'string' || typeof tc.password !== 'string') {
      throw new Error(`${tc.id}: "email" and "password" must be strings (use "" for empty)`);
    }
  }
  return data;
}

const data = validate(rawData as TestData);

export const boardTests = data.boardTests;
export const invalidLogins = data.invalidLogins;
