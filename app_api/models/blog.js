const mongoose = require ('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contenType: String
    },
    author: {
        type: ObjectId,
        ref: "Member"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    answers: [
        {
            content: String,
            created: {type: Date, default: Date.now},
            author: {type: ObjectId, ref: "Member"}
        }
    ] 
});

module.exports = mongoose.model('Blog', blogSchema);