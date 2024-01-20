const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userCollection = 'usuarios';

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    }
});


module.exports.User = model(userCollection, userSchema);
