// Define the FactType decorator
import { buildModel, JinagaTest, ModelBuilder, User } from "jinaga";

class Project {
  static Type = "Construction.Project" as const;
  type = Project.Type;

  constructor(public creator: User, public id: string) {}
}

const constructionModel = (b: ModelBuilder) => b
  .type(Project, m => m
    .predecessor("creator", User)
  )
  ;

const model = buildModel(b => b
  .with(constructionModel)
);

// Initialize Jinaga test client
const j = JinagaTest.create({
  user: new User("--- TEST USER ---")
});

// Example usage
(async () => {
  const { userFact: user, profile } = await j.login<User>();
  const projectA = await j.fact(new Project(user, crypto.randomUUID()));
  console.log("Created project:", projectA);

  // Create a couple more projects.
  const projectB = await j.fact(new Project(user, crypto.randomUUID()));
  const projectC = await j.fact(new Project(user, crypto.randomUUID()));

  const projectsCreatedByUser = model.given(User).match(u =>
    u.successors(Project, p => p.creator)
  );

  const projects = await j.query(projectsCreatedByUser, user);
})();
