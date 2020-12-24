const mongoose = require ('mongoose')

const schemaPost = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', schemaPost);