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

const model = buildModel(b => b
  .type(Site)
  .type(Post, m => m
    .predecessor("site", Site)
  )
);

const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
);

(async () => {
  const site = await populateData();
  const posts = await j.query(postsInSite, site);
  console.log(JSON.stringify(posts, null, 2));
})();

async function populateData() {
  const site = await j.fact(new Site('qedcode.com'));
  await j.fact(new Post(
    new Date(),
    site
  ));
  await j.fact(new Post(
    new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    site
  ));
  await j.fact(new Post(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    site
  ));

  return site;
}