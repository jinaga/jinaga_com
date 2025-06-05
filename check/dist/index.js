"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define the FactType decorator
const jinaga_1 = require("jinaga");
class Project {
    constructor(creator, id) {
        this.creator = creator;
        this.id = id;
        this.type = Project.Type;
    }
    static by(user) {
        return user.successors(Project, p => p.creator)
            .notExists(p => p.successors(ProjectDeleted, d => d.project)
            .notExists(d => d.successors(ProjectRestored, r => r.deleted)));
    }
}
Project.Type = "Construction.Project";
class ProjectDeleted {
    constructor(project, deletedAt) {
        this.project = project;
        this.deletedAt = deletedAt;
        this.type = ProjectDeleted.Type;
    }
}
ProjectDeleted.Type = "Construction.Project.Deleted";
class ProjectRestored {
    constructor(deleted) {
        this.deleted = deleted;
        this.type = ProjectRestored.Type;
    }
}
ProjectRestored.Type = "Construction.Project.Restored";
class ProjectName {
    constructor(project, value, prior) {
        this.project = project;
        this.value = value;
        this.prior = prior;
        this.type = ProjectName.Type;
    }
    static of(project) {
        return project.successors(ProjectName, name => name.project)
            .notExists(name => name.successors(ProjectName, next => next.prior));
    }
}
ProjectName.Type = "Construction.Project.Name";
const constructionModel = (b) => b
    .type(Project, m => m
    .predecessor("creator", jinaga_1.User))
    .type(ProjectDeleted, m => m
    .predecessor("project", Project))
    .type(ProjectRestored, m => m
    .predecessor("deleted", ProjectDeleted))
    .type(ProjectName, m => m
    .predecessor("project", Project)
    .predecessor("prior", ProjectName));
const model = (0, jinaga_1.buildModel)(b => b
    .with(constructionModel));
// Initialize Jinaga test client
const j = jinaga_1.JinagaTest.create({
    user: new jinaga_1.User("--- TEST USER ---")
});
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { userFact: user, profile } = yield j.login();
    const projectA = yield j.fact(new Project(user, crypto.randomUUID()));
    console.log("Created project:", projectA);
    // Create a couple more projects.
    const projectB = yield j.fact(new Project(user, crypto.randomUUID()));
    const projectC = yield j.fact(new Project(user, crypto.randomUUID()));
    // Query all projects created by user (before deletion)
    const projectsCreatedByUser = model.given(jinaga_1.User).match(u => u.successors(Project, p => p.creator));
    const allProjects = yield j.query(projectsCreatedByUser, user);
    console.log("All projects (before deletion):", allProjects.length);
    // Delete projectA
    const projectADeleted = yield j.fact(new ProjectDeleted(projectA, new Date()));
    console.log("Deleted project:", projectADeleted);
    // Query projects again with the same specification (deletion not filtered)
    const projectsStillIncludingDeleted = yield j.query(projectsCreatedByUser, user);
    console.log("Projects (deletion not filtered):", projectsStillIncludingDeleted.length);
    // Query projects with deletion filter
    const activeProjectsCreatedByUser = model.given(jinaga_1.User).match(u => u.successors(Project, p => p.creator)
        .notExists(p => p.successors(ProjectDeleted, d => d.project)));
    const activeProjects = yield j.query(activeProjectsCreatedByUser, user);
    console.log("Active projects (after filtering deleted):", activeProjects.length);
    // Restore projectA
    const projectARestored = yield j.fact(new ProjectRestored(projectADeleted));
    console.log("Restored project:", projectARestored);
    // Query projects with deletion and restore filter
    const projectsWithRestore = model.given(jinaga_1.User).match(u => u.successors(Project, p => p.creator)
        .notExists(p => p.successors(ProjectDeleted, d => d.project)
        .notExists(d => d.successors(ProjectRestored, r => r.deleted))));
    const projectsAfterRestore = yield j.query(projectsWithRestore, user);
    console.log("Projects (after restore filtering):", projectsAfterRestore.length);
    console.log("\n=== Mutable Properties Pattern ===");
    // Set initial project name
    const projectAName1 = yield j.fact(new ProjectName(projectA, "Cheyenne Expansion", []));
    console.log("Set initial project name:", projectAName1.value);
    // Change the name (create new fact with prior)
    const projectAName2 = yield j.fact(new ProjectName(projectA, "Rivercrest Expansion", [projectAName1]));
    console.log("Changed project name:", projectAName2.value);
    // Query for current name (filtering out superseded versions)
    const currentNamesOfProject = model.given(Project).match(project => ProjectName.of(project));
    const currentNames = yield j.query(currentNamesOfProject, projectA);
    console.log("Current project names:", currentNames.map(n => n.value));
    // Simulate concurrent edit (another name change from original)
    const projectAName3 = yield j.fact(new ProjectName(projectA, "Cheyenne Remodel", [projectAName1]));
    console.log("Concurrent edit - created another name:", projectAName3.value);
    // Query again - should show both concurrent values
    const concurrentNames = yield j.query(currentNamesOfProject, projectA);
    console.log("After concurrent edit (conflict):", concurrentNames.map(n => n.value));
    // Merge the conflicts by creating a new name that references both prior values
    const projectAName4 = yield j.fact(new ProjectName(projectA, "Rivercrest Remodel", concurrentNames));
    console.log("Merged name:", projectAName4.value);
    // Query one final time - should show only the merged result
    const finalNames = yield j.query(currentNamesOfProject, projectA);
    console.log("After merge (resolved):", finalNames.map(n => n.value));
    console.log("\n=== Projections Pattern ===");
    // Give names to the other projects
    yield j.fact(new ProjectName(projectB, "Pinecrest School Expansion", []));
    yield j.fact(new ProjectName(projectC, "Brookside Office Park Fit-Out", []));
    // Create a projection using the encapsulated specifications
    const projectsWithNamesCreatedByUser = model.given(jinaga_1.User).match(u => Project.by(u)
        .select(p => ({
        projectId: p.id,
        names: ProjectName.of(p)
            .select(n => n.value)
    })));
    const projections = yield j.query(projectsWithNamesCreatedByUser, user);
    console.log("Projects with names:");
    projections.forEach(p => {
        console.log(`  ${p.projectId}: [${p.names.join(", ")}]`);
    });
}))();
