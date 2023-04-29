class Site {
  static Type = "Blog.Site" as const;
  public type = Site.Type;

  constructor(
    public domain: string
  ) { }
}

class Post {
  static Type = "Blog.Post" as const;
  public type = Post.Type;

  constructor(
    public createdAt: Date | string,
    public site: Site
  ) { }
}

(async () => {
  const site = await j.fact(new Site('qedcode.com'));
  const post = await j.fact(new Post(
    new Date(),
    site
  ));

  // A predecessor is just another JSON object.
  // It's called a predecessor becuase it comes first.
  // In this case, we have to have a site before we can write a post.
  console.log(JSON.stringify(post, null, 2));
})();
