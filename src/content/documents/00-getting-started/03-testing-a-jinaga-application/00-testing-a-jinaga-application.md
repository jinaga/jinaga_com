---
title: "Testing a Jinaga Application"
---

Testing with Jinaga is pretty fun.
You can create a test harness that exercises all of your application's storage and query logic.
You can even test authorization rules to make sure that your app is secure.

When you initialize your NPM project package with `npm init`, you can set the test command to `jest`.
But if you have already initialized it, don't worry.
Just set the `test` script in your `package.json` as follows:

```json
"scripts": {
    "test": "jest"
}
```

To get started you will need to install a couple of NPM dependencies.

```bash
npm i jinaga
npm i -D jest
```

Then you can set up your first test.
In this test, initialize a Jinaga instance for testing.
Then you can create facts in that Jinaga instance.
Every fact has a type, which is a string.

Create a file in `src/model.test.js`:

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

Run your tests using `npm test`.
