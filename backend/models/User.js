const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// package schema de mongoose
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});


userSchema.plugin(uniqueValidator);
// export avec fonction model de mongoose
module.exports = mongoose.model("User", userSchema);