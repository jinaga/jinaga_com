// Import Jinaga
import { Jinaga, JinagaTest, JinagaClient } from "jinaga";

// Create a Jinaga client for local state in IndexedDB
const j = JinagaClient.create({
  httpEndpoint: "https://rep.jinaga.com/myreplicator",
  indexedDb: "my-application-state"
});

// Create a Jinaga client for unit tests with an in-memory store
const testClient = JinagaTest.create({
  user: "--- TEST USER ---",
});

// Jinaga replicator configuration
// Note: Replicators are servers that synchronize data with clients.
// They are configured with security rules and can connect to other replicators
// to form a mesh network for data flow.