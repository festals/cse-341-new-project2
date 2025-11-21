const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    githubId: {type: String, unique: true},
    email: String,
    username: String,
    password: String
}, { collection: 'users' });

const User = model('User', userSchema);
module.exports = { User };