const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://wanaw-digital-solutions.onrender.com/api/auth/google/callback"
          : "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails && emails[0].value;

        if (!email) {
          throw new Error("No email found in Google profile");
        }

        let user = await User.findOne({ googleId: id });

        if (!user) {
          user = await User.create({
            fullName: displayName,
            email,
            googleId: id,
            password: "",
            role: "individual",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ ADD THIS
passport.serializeUser((user, done) => {
  done(null, user.id); // store user id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // get user from db using id
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

