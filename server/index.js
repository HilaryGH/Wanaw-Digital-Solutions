const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const serviceRoutes = require("./routes/service");
const notificationRoutes = require('./routes/notificationRoutes');



dotenv.config();

const app = express();
connectDB();

// ✅ Allowed frontend origins (local + Netlify)
const allowedOrigins = [
  "http://localhost:5173",
  "https://wanawhealthandwellness.netlify.app",
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow undefined origin (like <img> tag requests)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ Session middleware (must come BEFORE passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ✅ Passport setup (initialize and session)
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Route mounting
app.use("/api/auth", require("./routes/auth"));
app.use("/api/services", serviceRoutes);


app.use("/api/gift", require("./routes/gift"));
app.use("/api/admin/posts", require("./routes/admin.blog"));
app.use("/api/posts", require("./routes/blog"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/support", require("./routes/support"));
app.use("/api/programs", require("./routes/programs"));
app.use("/api/membership", require("./routes/membership"));

app.use("/api/services", require("./routes/service"));
app.use("/api/payment", require("./routes/payment"));
app.use('/api/notifications', notificationRoutes);
app.use("/api/upload", require("./routes/upload"));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





