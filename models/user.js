const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  oauthId: { type: String, unique: true }, // unique index to prevent duplicate OAuth IDs
  oauthProvider: { type: String },
  created: { type: Date, default: Date.now },
});

// Plugin passport-local-mongoose for password handling if needed
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
