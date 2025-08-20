const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const path = require("path");

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



// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route mounting
app.use("/api/auth", require("./routes/auth"));

const partnerRoutes = require("./routes/partnerRoutes");
app.use("/api", partnerRoutes);

app.use("/api/gift", require("./routes/gift"));
app.use("/api/admin/posts", require("./routes/admin.blog"));
app.use("/api/posts", require("./routes/blog"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/support", require("./routes/support"));
app.use("/api/programs", require("./routes/programs"));
app.use("/api/membership", require("./routes/membership"));


app.use("/api/payment", require("./routes/payment"));
app.use('/api/notifications', notificationRoutes);
app.use("/api/upload", require("./routes/upload"));
app.use("/api/users", require("./routes/userRoute"));
const serviceRoutes = require("./routes/service");     // ✅ This is correct
app.use("/api/services", serviceRoutes);

const communityRoutes = require("./routes/communityRoutes");
app.use("/api/community", communityRoutes);

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

const applicationRoutes = require('./routes/applicationRoutes');

app.use('/api/applications', applicationRoutes);

const kidneyPatientRoutes = require("./routes/kidneyPatientRoutes");
app.use("/api/kidney-patients", kidneyPatientRoutes);



const supportCommunityRoutes = require("./routes/supportCommunityRoutes");
app.use("/api/support-community", supportCommunityRoutes);

const diasporaRoutes = require("./routes/diasporaRoutes");
app.use("/api/diaspora-members", diasporaRoutes)

const subscribeRoute = require("./routes/subscribe");
app.use("/api/subscribe", subscribeRoute);

const hotelRoutes = require("./routes/hotel");
app.use("/hotel", hotelRoutes);


app.use("/api/purchase", require("./routes/purchase"));

// ✅ Chatbot routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

// Adjust path as needed


// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





