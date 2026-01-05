import { storage } from "../server/storage";
import { db } from "../server/db";

async function seed() {
  console.log("Seeding database...");

  // Clear existing history if you want, or just add
  // await storage.clearHistory();

  // Add sample notes
  const notes = await storage.getNotes();
  if (notes.length === 0) {
    await storage.createNote({
      title: "Welcome to Calculator Plus",
      content: "Explore the different modes using the sidebar. You can save your calculations here!",
      category: "General"
    });
    await storage.createNote({
      title: "Shopping List",
      content: "1. Milk\n2. Eggs\n3. Bread",
      category: "Personal"
    });
  }

  // Add sample history
  const history = await storage.getHistory();
  if (history.length === 0) {
    await storage.addToHistory({
      expression: "2 + 2",
      result: "4",
      category: "Basic"
    });
    await storage.addToHistory({
      expression: "sin(45 deg)",
      result: "0.70710678",
      category: "Scientific"
    });
    await storage.addToHistory({
      expression: "100 USD to EUR",
      result: "92.50 EUR",
      category: "Finance"
    });
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
