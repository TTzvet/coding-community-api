const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const Question = require("./question");
const Blog = require("./blog");
const Event = require("./event");
 
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String,
  },
  about: {
    type: String
  },
  linkedin: {
    type: String
  },
  interest: {
    type: String
  },
  contribution: {
    type: String
  }
});

// member password encryption
memberSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hash = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
 
// methods - login authentication
memberSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hash;
  }, 
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};
 
// remove all questions and answers when member account is closed
memberSchema.pre("remove", function (next) {
  Question.remove({ author: this._id }).exec();
  next();
});

memberSchema.pre("remove", async function (next) {
  await Question.remove({ author: this._id }).exec();
  await Question.updateMany(
    {},
    { $pull: { answers: { author: this._id } } },
    { new: true, multi: true }
  ).exec();
  next();
});

// remove all blogs and answers when member account is closed
memberSchema.pre("remove", function (next) {
  Blog.remove({ author: this._id }).exec();
  next();
});

memberSchema.pre("remove", async function (next) {
  await Blog.remove({ author: this._id }).exec();
  await Blog.updateMany(
    {},
    { $pull: { answers: { author: this._id } } },
    { new: true, multi: true }
  ).exec();
  next();
});

// remove all events and answers when member account is closed
memberSchema.pre("remove", function (next) {
  Event.remove({ author: this._id }).exec();
  next();
});

memberSchema.pre("remove", async function (next) {
  await Event.remove({ author: this._id }).exec();
  await Event.updateMany(
    {},
    { $pull: { answers: { author: this._id } } },
    { new: true, multi: true }
  ).exec();
  next();
});

 
module.exports = mongoose.model("Member", memberSchema);