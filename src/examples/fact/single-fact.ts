class Site {
  static Type = "Blog.Site" as const;
  public type = Site.Type;

  constructor(
    public domain: string
  ) { }
}

(async () => {
  const site = await j.fact(new Site('qedcode.com'));

  // A fact is just a JSON object that has a `type` field.
  console.log(JSON.stringify(site, null, 2));
})();