const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false},
    userID: {type: String, required: true, unique: true , default: uuidv4}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
