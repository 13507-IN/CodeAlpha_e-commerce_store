const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
  house: String,
  city: String,
  pincode: String,
  state: String,
  country: String
}

});

module.exports = mongoose.model('User', UserSchema);
