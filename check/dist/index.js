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
class User {
    constructor(publicKey) {
        this.publicKey = publicKey;
        this.type = User.Type;
    }
}
User.Type = "Jinaga.User";
class Project {
    constructor(creator, id) {
        this.creator = creator;
        this.id = id;
        this.type = Project.Type;
    }
}
Project.Type = "Construction.Project";
// Initialize Jinaga test client
const testClient = jinaga_1.JinagaTest.create({
    user: "--- TEST USER ---",
});
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User("--- TEST USER ---");
    const project = yield testClient.fact(new Project(user, crypto.randomUUID()));
    console.log("Created project:", project);
}))();
