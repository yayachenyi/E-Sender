const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const mongoose = require('mongoose');
const keys = require('../config/key');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser( (id, done) => {
  User.findById(id)
   .then(user => {done(null, user)});
});
passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/auth/facebook/callback'
  },
  (accessToken, refreshToeken, profile, done) =>{
    User.findOne({facebookId: profile.id})
     .then((existingUser) => {
       if(existingUser){
         //already have a record with the given profile ID
         done(null, existingUser);
       }else{
         //make a new record
         new User({facebookId: profile.id}).save()
          .then(user => {done(null,user)});
          //create a new instance in mongodb, now in express only, not in mongodb,save will solve this
       }
     });// return promise
    }
));
passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
},
(accessToken, refreshToeken, profile, done) =>{
  User.findOne({googleId: profile.id})
   .then((existingUser) => {
     if(existingUser){
       //already have a record with the given profile ID
       done(null, existingUser);
     }else{
       //make a new record
       new User({googleId: profile.id}).save()
        .then(user => {done(null,user)});
        //create a new instance in mongodb, now in express only, not in mongodb,save will solve this
     }
   });// return promise
  }
));
