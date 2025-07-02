const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const lookupRoutes = require("./routes/lookupRoutes");
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// JSON body parser
app.use(express.json());

// --- Global rate limiting middleware (middlewares/rateLimiter.js) ---
app.use(rateLimiter);

// API routes
app.use("/api/products", productRoutes);
app.use("/api/lookup", lookupRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
