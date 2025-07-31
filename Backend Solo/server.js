const express = require("express");
const authRoutes = require("./routes/authRoutes"); // Fixed: Remove destructuring
const { testConnection, sequelize } = require("./viable/db"); // Fixed: Correct imports
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Fixed: Use correct import name

// Start server with database connection
const startServer = async () => {
    try {
        await testConnection(); // Fixed: Use correct function name
        await sequelize.sync();
        
        app.listen(3000, () => {
            console.log("✅ Server is running on port 3000");
            console.log("📱 API URL: http://localhost:3000/api");
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
