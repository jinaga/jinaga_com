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
const constructionModel = (b) => b
    .type(Project, m => m
    .predecessor("creator", jinaga_1.User))
    .type(ProjectDeleted, m => m
    .predecessor("project", Project))
    .type(ProjectRestored, m => m
    .predecessor("deleted", ProjectDeleted));
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
}))();
