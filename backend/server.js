const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 1031; // Halloween port! 🎃

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Initialize SQLite database
const db = new sqlite3.Database("halloween_tracker.db");

// Create records table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Helper function to format time as HH:MM
function formatTime(date) {
  return date.toTimeString().substring(0, 5);
}

// Helper function to generate minute-by-minute stats
function generateMinuteStats(records, callback) {
  if (records.length === 0) {
    return callback([]);
  }

  // Group records by minute
  const recordsByMinute = {};
  records.forEach((record) => {
    const date = new Date(record.timestamp);
    const timeKey = formatTime(date);
    recordsByMinute[timeKey] = (recordsByMinute[timeKey] || 0) + 1;
  });

  // Get first and last record times
  const firstRecord = new Date(records[0].timestamp);
  const lastRecord = new Date(records[records.length - 1].timestamp);

  // Generate complete timeline
  const stats = [];
  const current = new Date(firstRecord);
  current.setSeconds(0, 0); // Reset to start of minute

  const end = new Date(lastRecord);
  end.setSeconds(59, 999); // End of the last minute

  while (current <= end) {
    const timeKey = formatTime(current);
    stats.push({
      time: timeKey,
      count: recordsByMinute[timeKey] || 0,
    });
    current.setMinutes(current.getMinutes() + 1);
  }

  callback(stats);
}

// Routes

// Serve the main counter page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Serve the stats page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/stats.html"));
});

// Add a new record
app.post("/api/record", (req, res) => {
  db.run("INSERT INTO records DEFAULT VALUES", function (err) {
    if (err) {
      console.error("Error inserting record:", err);
      return res.status(500).json({ error: "Failed to add record" });
    }

    // Get total count
    db.get("SELECT COUNT(*) as count FROM records", (err, row) => {
      if (err) {
        console.error("Error getting count:", err);
        return res.status(500).json({ error: "Failed to get count" });
      }

      res.json({ count: row.count });
    });
  });
});

// Get minute-by-minute statistics
app.get("/api/stats", (req, res) => {
  db.all("SELECT * FROM records ORDER BY timestamp ASC", (err, records) => {
    if (err) {
      console.error("Error fetching records:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }

    generateMinuteStats(records, (stats) => {
      res.json(stats);
    });
  });
});

// Get current count
app.get("/api/count", (req, res) => {
  db.get("SELECT COUNT(*) as count FROM records", (err, row) => {
    if (err) {
      console.error("Error getting count:", err);
      return res.status(500).json({ error: "Failed to get count" });
    }

    res.json({ count: row.count });
  });
});

// Reset all records (delete all data)
app.delete("/api/reset", (req, res) => {
  db.run("DELETE FROM records", function (err) {
    if (err) {
      console.error("Error resetting records:", err);
      return res.status(500).json({ error: "Failed to reset records" });
    }

    console.log(`🎃 Halloween Tracker reset! Deleted ${this.changes} records.`);
    res.json({ 
      message: "All records have been reset for a new Halloween night!", 
      deletedCount: this.changes,
      newCount: 0 
    });
  });
});

app.listen(PORT, () => {
  console.log(`🎃 Halloween Tracker server running on spooky port ${PORT}`);
  console.log(`👻 Counter page: http://localhost:${PORT}`);
  console.log(`📊 Stats page: http://localhost:${PORT}/stats`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🎃 Shutting down Halloween Tracker...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("👻 Database connection closed.");
    }
    process.exit(0);
  });
});
