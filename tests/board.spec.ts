import { test } from '../fixtures/test';
import { boardTests } from '../data/loadTestData';

test.describe('Board: task placement and tags', { tag: '@board' }, () => {
  for (const { id, project, task, column, tags, expectedFailure } of boardTests) {
    const title = `${id}: ${project} › "${task}" is in "${column}" with tags [${tags.join(', ')}]`;

    test(`${title}${expectedFailure ? ' @expected-failure' : ''}`, async ({ loggedInBoard }) => {
      test.fail(!!expectedFailure, expectedFailure);

      await loggedInBoard.openProject(project);
      const card = await loggedInBoard.expectTaskInColumn(column, task);
      await loggedInBoard.expectTags(card, tags);
    });
  }
});
