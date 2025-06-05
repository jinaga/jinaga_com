// Define the FactType decorator
import { buildModel, JinagaTest, ModelBuilder, User } from "jinaga";

class Project {
  static Type = "Construction.Project" as const;
  type = Project.Type;

  constructor(public creator: User, public id: string) {}
}

class ProjectDeleted {
  static Type = "Construction.Project.Deleted" as const;
  type = ProjectDeleted.Type;

  constructor(public project: Project, public deletedAt: Date) {}
}

const constructionModel = (b: ModelBuilder) => b
  .type(Project, m => m
    .predecessor("creator", User)
  )
  .type(ProjectDeleted, m => m
    .predecessor("project", Project)
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

  // Query all projects created by user (before deletion)
  const projectsCreatedByUser = model.given(User).match(u =>
    u.successors(Project, p => p.creator)
  );

  const allProjects = await j.query(projectsCreatedByUser, user);
  console.log("All projects (before deletion):", allProjects.length);

  // Delete projectA
  const projectADeleted = await j.fact(new ProjectDeleted(projectA, new Date()));
  console.log("Deleted project:", projectADeleted);

  // Query projects again with the same specification (deletion not filtered)
  const projectsStillIncludingDeleted = await j.query(projectsCreatedByUser, user);
  console.log("Projects (deletion not filtered):", projectsStillIncludingDeleted.length);

  // Query projects with deletion filter
  const activeProjectsCreatedByUser = model.given(User).match(u =>
    u.successors(Project, p => p.creator)
      .notExists(p => p.successors(ProjectDeleted, d => d.project))
  );

  const activeProjects = await j.query(activeProjectsCreatedByUser, user);
  console.log("Active projects (after filtering deleted):", activeProjects.length);
})();
