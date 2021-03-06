// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const validator = require('validator');
module.exports = function (app) {
  const mongoose = app.get('mongooseClient');
  const { Schema } = mongoose;
  const users = new Schema({
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: { validator: value => validator.isEmail(value), message: 'Invalid email.' }
    },
    username: {
      type: String,
      unique: true,
      required: true,
      sparse: true
    },
    ersId: {
      type: Number,
      required: false,
      unique: true,
      sparse: true
    },
    spotmeId: { // this is app related, it would makes more sense in app stuff such as preferences for now.
      type: [String],
      required: false
    },
    key4Token: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: true
    },
    permissions: {
      type: [String],
      required: false
    }
  },
  {
    timestamps: true
  });

  return mongoose.model('users', users);
};
