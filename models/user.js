const mongoose = require ('mongoose');

const schemaUser = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true 
    },
    password_hash: {
        type: String,
        required: true
    },
    salt_data: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
})

mogule.exports = mongoose.model('User', schemaUser)