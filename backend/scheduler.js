// scheduler.js
const cron = require("node-cron");
const Availability = require("./models/Availability");

console.log("Scheduler initialized.");

// Schedule a task to run every day at 9:00 PM
cron.schedule("0 21 * * *", async () => {
  console.log("Running scheduled job: Deleting past availability slots.");
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Delete all availability documents for dates before today
    const deletionResult = await Availability.deleteMany({
      date: { $lt: today },
    });
    console.log(
      `Successfully deleted ${deletionResult.deletedCount} past availability documents.`
    );
  } catch (error) {
    console.error("Error during scheduled availability cleanup:", error);
  }
});
