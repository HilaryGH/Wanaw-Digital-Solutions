const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",  // your frontend dev origin
  credentials: true,
}));

app.use(express.json());

const giftRoutes = require("./routes/gift");
app.use("/api/gift", giftRoutes);

const adminBlogRoutes = require("./routes/admin.blog");
app.use("/api/admin/posts", adminBlogRoutes);

const blogRoutes = require("./routes/blog");   // <-- this file
app.use("/api/posts", blogRoutes);             // path matches front‑end

app.use("/api/blog", blogRoutes);

const supportRoutes = require("./routes/support");
app.use("/api/support", supportRoutes);



const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const programsRouter = require("./routes/programs");

app.use("/api/programs", programsRouter);



app.use("/api/auth", require("./routes/auth"));
const membershipRoutes = require("./routes/membership");
app.use("/api/membership", membershipRoutes);
// Mount user-management routes (for admin dashboard)
app.use("/api/users", require("./routes/users"));  // or "./routes/users" if you renamed the file
const serviceRoutes = require("./routes/service");
app.use("/api/services", serviceRoutes);
app.use("/api/payment", require("./routes/payment"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




