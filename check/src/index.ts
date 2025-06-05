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
  const project = await j.fact(new Project(user, crypto.randomUUID()));
  console.log("Created project:", project);
})();
