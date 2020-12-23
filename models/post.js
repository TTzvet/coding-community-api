const mongoose = require ('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title required',
        minlength: 5,
        maxlength: 150
    },
    body: {
        type: String,
        required: 'Body required',
        minlength: 15,
        maxlength: 1500
    }
});

module.exports = mongoose.model('Post', postSchema);