---
title: "Write Some Tests (JavaScript)"
---

This assumes that you have [created a Node Application](../../setup-steps/create-node-app/) and [installed Jinaga](../../setup-steps/install-jinaga/).

The easiest way to see Jinaga working is to write some tests.
For that, you will need a test runner.
We like [Jest](https://jestjs.io/).

```bash
npm i -D jest
```

Open up your `package.json` file and modify your `test` script.

```json
"scripts": {
    "test": "jest"
}
```

Then you can run tests using `npm test`.
When you try that now, you will get an error.
No tests were found!
So write one.

Create a new folder called `src`.
Inside of this folder, create a file called `model.test.js`:

```javascript
const { JinagaTest } = require("jinaga");

var j;

beforeEach(() => {
    j = JinagaTest.create({});
})

test("Can create a fact", async () => {
    const firstFact = await j.fact({
        type: "MyApplication.FirstFact",
        identifier: "my_fact_id"
    });

    expect(firstFact.identifier).toBe("my_fact_id");
});
```

Every test is going to have the same structure.
Inside of `beforeEach`, you create an instance of Jinaga using the `JinagaTest` factory.
You can then add facts, run queries, and perform all of the other operations in a testing sandbox.

You can run your new test with `npm test`.