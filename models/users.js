const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: Number,
    available_ingredients: [String]
});

const Users = mongoose.model('user', UserSchema);

module.exports = Users;