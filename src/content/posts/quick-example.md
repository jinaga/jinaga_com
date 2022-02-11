---
title: "Quick Example"
---

### Facts

A Jinaga data model is made of **facts**.
A fact is an immutable JavaScript object which has a `type` field.
Write a TypeScript or JavaScript class to help you create them.
Here's an example in TypeScript.

```typescript
class Tweet {
    static Type = "Tweet" as const;
    type = Tag.Type;

    constructor(
        public body: string,
        public sender: User,
        public sent: Date | string
    ) { }
}
```

See that `User` type?
That's another fact.
That's how facts are related to each other.

### Creating facts

Whenever the user does something, like send a tweet, your app creates a fact.
Use the function `j.fact` to do that.

```javascript
await j.fact(new Tweet(
    "Twas Brillig, and the slithy toves did gyre and gimble in the wabe.",
    lewiscarroll,
    new Date()
));
```

Call the `j.fact` function within the browser whenever you want to save something.
It will be sent to the server, where it will be stored.
You don't need a custom API for that.

### Finding facts

To find a set of facts, first define a **specification function**.
These are usually static functions on the fact class.

```typescript
class Tweet {
    // ...
    static fromSender(sender: User) {
        return j.match<Tweet>({
            type: Tweet.Type,
            sender
        });
    }
}
```

The **query** method returns all facts matching the specification.

```typescript
const tweets = await j.query(lewiscarroll, j.for(Tweet.fromSender));
```

Again, run this code in the browser.
There is no need to set up an API to perform this query on the server.

### Displaying facts

A query is a one-time operation.
If you want to update the UI every time a tweet is posted, compose a **projection specification**.

```typescript
const tweetSpec = specificationFor(Tweet, {
    body: field(t => t.body),
    sender: property(
        j.for(Tweet.sender)
            .then(User.names),
        n => n.value,
        "<sender>"
    )
});
```

Then map the specification to props of a component.

```tsx
const tweetMapping = mapProps(tweetSpec).to(({ body, sender }) => (
    <div>
        <p>{body}</p>
        <p>{sender}</p>
    </div>
));
```

### Composing components

Reference mappings inside of specifications to compose the application.

```javascript
const feedSpec = specificationFor(User, {
    Tweets: collection(
        j.for(Follow.byUser)
            .then(Follow.sender)
            .then(Tweet.fromSender),
        tweetMapping
    )
});

const feedMapping = mapProps(feedSpec).to(({ Tweets }) => (
    <div>
        <Tweets />
    </div>
));
```

Top it all off with a container.

```tsx
const FeedContainer = jinagaContainer(j, feedMapping);

function App({}) {
    const [ user, setUser ] = useState<User | null>(null);

    useEffect(() => {
        j.login().then(({ userFact }) => {
            setUser(userFact);
        });
    }, []);

    return (
        <FeedContainer fact={user} />
    );
}
```

### Subscribing to facts

To have new tweets pushed to the browser, call **subscribe**.

```javascript
j.subscribe(lewiscarroll, j.for(Tweets.fromSender));
```

And with this, facts created in one browser make their way to other browsers.
You didn't write a custom API.
You didn't set up a Web Socket listener.
You didn't define a custom database schema.

Jinaga synchronizes immutable facts from browser, to server, and back again.
It persists them durably, transmits them reliably, and updates the view automatically.