class Tag {
    static Type = 'Blog.Tag' as const;
    type = Tag.Type;

    constructor(
        public name: string
    ) { }
}

class Post {
    static Type = 'Blog.Post' as const;
    type = Post.Type;

    constructor(
        public created: Date,
        public author: User
    ) { }
}

class Tags {
    static Type = 'Blog.Post.Tags' as const;
    type = Tags.Type;

    constructor(
        public post: Post,
        public tags: Tag[]
    ) { }
}

(async () => {
    // The predecessors are all listed out inline.
    // You don't have to call j.fact for each and every one.
    const tags = await j.fact(
        new Tags(
            new Post(
                new Date(),
                new User('---IF THIS WERE A REAL USER, THEIR PUBLIC KEY WOULD BE HERE---')
            ),
            [
                new Tag('React'),
                new Tag('CSS'),
                new Tag('Micro-Frontends')
            ]
        )
    );

    console.log(JSON.stringify(tags, null, 2));
})();