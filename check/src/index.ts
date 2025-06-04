// Define the FactType decorator
import { JinagaTest } from "jinaga";

class User {
  static Type = "Jinaga.User" as const;
  type = User.Type;

  constructor(public publicKey: string) {}
}

class Project {
  static Type = "Construction.Project" as const;
  type = Project.Type;

  constructor(public creator: User, public id: string) {}
}

// Initialize Jinaga test client
const j = JinagaTest.create({
  user: "--- TEST USER ---",
});

// Example usage
(async () => {
  const { userFact: user, profile } = await j.login<User>();
  const project = await j.fact(new Project(user, crypto.randomUUID()));
  console.log("Created project:", project);
})();
