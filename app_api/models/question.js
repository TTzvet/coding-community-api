const mongoose = require ('mongoose');
const { ObjectId } = mongoose.Schema;

const questionSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
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
    interests: [{ type: ObjectId, ref: "Member"}],
    answers: [
        {
            content: String,
            created: {type: Date, default: Date.now},
            author: {type: ObjectId, ref: "Member"}
        }
    ] 
});

module.exports = mongoose.model('Question', questionSchema);