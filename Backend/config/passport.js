const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth attempt:', {
          clientID: process.env.GOOGLE_CLIENT_ID,
          redirectURI: process.env.GOOGLE_REDIRECT_URI,
        });
        console.log('Google profile:', profile);

        let user = await User.findOne({ gmail: profile.emails[0].value });

        if (user) {
          console.log('Existing user found:', user);
          return done(null, user);
        }

        const tempUser = {
          googleId: profile.id,
          name: profile.displayName,
          gmail: profile.emails[0].value,
        };
        console.log('New user, needs rollNo:', tempUser);
        return done(null, false, { needsRollNo: true, ...tempUser });
      } catch (error) {
        console.error('Error in Google strategy:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserialized user:', user);
    done(null, user);
  } catch (error) {
    console.error('Error in deserializeUser:', error);
    done(error, null);
  }
});

module.exports = passport;