# Demo – Playwright Test Suite

Data-driven Playwright tests (TypeScript) for the Demo app. All test cases come from `data/testCases.json`, and one test body runs for each entry.

## What it tests

Each test logs in, opens a project, and checks that a task is in the right column with the right tags.

| ID  | Project            | Task                          | Column      | Tags                   |
| --- | ------------------ | ----------------------------- | ----------- | ---------------------- |
| TC1 | Web Application    | Implement user authentication | To Do       | Feature, High Priority |
| TC2 | Web Application    | Fix navigation bug            | To Do       | Bug                    |
| TC3 | Web Application    | Design system updates         | In Progress | Design                 |
| TC4 | Mobile Application | Push notification system      | To Do       | Feature                |
| TC5 | Mobile Application | Offline mode                  | In Progress | Feature, High Priority |
| TC6 | Mobile Application | App icon design               | Done        | Design                 |

Also included:

- **NEG1–NEG3:** invalid logins (wrong password, unknown user, empty fields) are rejected.
- **FAIL1–FAIL2:** deliberately wrong cases, marked as expected failures, to show the suite catches mistakes.

## Setup

Requires Node.js 18+.

```bash
npm install
npx playwright install chromium
```

## Run

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm test`             | Run all tests                                            |
| `npm run demo`         | Run slowly in a visible browser, highlighting each check |
| `npm run demo:failure` | Same as demo, only the deliberately failing cases        |
| `npm run test:ui`      | Open Playwright UI mode                                  |
| `npm run report`       | Open the HTML report from the last run                   |
| `npm run check`        | Lint, format check and typecheck                         |

## Add a test case

Add an entry to `boardTests` in `data/testCases.json`. No code changes needed.

```json
{ "id": "TC7", "project": "Web Application", "task": "Some task", "column": "Done", "tags": ["Bug"] }
```

## Project structure

```
data/       test cases (JSON) and their types
pages/      page objects for the login page and the board
fixtures/   shared setup (logs in before each board test)
tests/      test specs
config/     credentials from environment variables
utils/      demo-mode highlighting
```

## Configuration

Optional: copy `.env.example` to `.env` to override the URL or credentials.
