const mongoose = require('mongoose');

/**
 * Schema definition for the User model.
 * @typedef {Object} User
 * @property {String} username - A unique username for the user. Required.
 * @property {String} password - The user's password. Required.
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


module.exports = mongoose.model('User', UserSchema);