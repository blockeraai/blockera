# test-e2e-cypress

While writing e2e cypress tests it's important to follow following rules:

- always use test id to pick elements. if element is by our codes and does not have test id then you have to add it.

- it's important to create commands in the dev-cypress package for redundant tasks and also use current commands.

- If you added a new test case or updated one, then add only to it and run command to verify test runs without problem and also only that tests runs.
