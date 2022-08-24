---
title: "Write Some Tests (TypeScript)"
---

Testing in TypeScript is almost as easy as with JavaScript.
You just need to install a few additional packages.

```bash
npm i -D jest @types/jest ts-jest
```

Then configure Jest to use the [ts-jest](https://www.npmjs.com/package/ts-jest) plugin.

```bash
npx ts-jest config:init
```

This will create a `jest.config.js`.
This file configures Jest to use the preset `ts-jest` to run tests in Node.

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
Then create a subfolder called `shared`.
We put code here that can be used by either the client or the server.
Inside of this folder, create a file called `model.test.ts`:

```typescript
import { Jinaga, JinagaTest } from "jinaga";

var j: Jinaga;

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

You import `JinagaTest` so that you can initialize an instance of the `Jinaga` class.
Since you are using TypeScript, you also import `Jinaga` so that you have the type information.

Every test is going to have the same structure.
Inside of `beforeEach`, you create an instance of Jinaga using the `JinagaTest` factory.
You can then add facts, run queries, and perform all of the other operations in a testing sandbox.

You can run your new test with `npm test`.

When you build your project, TypeScript will also build your tests.
You might not want this.
To exclude tests from the build, add an `exclude` section to `tsconfig.json`:

```json
{
    "exclude": [
        "src/**/*.test.ts"
    ]
}
```