const _ = require('lodash');
const Question = require('../models/question')
const formidable = require('formidable');
const fs = require('fs');

exports.questionById = (request, response, next, id) => {
    Question.findById(id)
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .exec((err, question) => {
            if (err || !question) {
                return response.status(400).json({
                    error: err
                })
            }
            request.question = question
            next()
        });
}

exports.isAuthor = (request, response, next) => {
    let isAuthor = request.question && request.auth && request.question.author._id == request.auth._id
    // console.log("request.question: ", request.question);
    // console.log("request.auth: ", request.auth);
    // console.log("request.question.author._id : ", request.question.questionBy._id);
    // console.log("request.auth._id : ", request.auth._id);

    if (!isAuthor) {
        return response.status(403).json({
            error: "No access."
        })
    }
    next()
}

exports.updateQuestion = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields) => {
        let question = request.question;
        question = _.extend(question, fields)
        question.updated = Date.now()
        question.save((err, result) => {
            if(err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(question);
        })
    })
}

exports.deleteQuestion = (request, response) => {
    let question = request.question
    question.remove((err, question) => {
        if (err) {
            return response.status(400).json({
                error: err
            })
        }
        response.status(200).json({
            message: "This question has been successfully deleted."
        })
    })
};

exports.question = (request, response) => {
    return response.json(request.question);
}

exports.getAllQuestions = (request, response) => {
    const questions = Question.find()
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .select('_id heading body created interests')
        .sort({ created: -1 })
        .then((questions) => {
            response.json(questions);
        })
        .catch(error => console.log(error));
};

exports.searchText = (request, response) => {
    const searchBody = request.body
    let searchTerm = searchBody['searchTerm']
    // console.log("search_term is")
    // console.log(searchTerm)
    Question.find({ 'body': { '$regex': searchTerm, '$options': 'i' } })
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .select('_id heading body created interests')
        .sort({ created: -1 })
        .then((questions) => {
            response.json(questions);
        })
        .catch(error => console.log(error));
}

exports.createQuestion = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields, files) => {
        let question = new Question(fields)

        request.profile.hash = undefined
        request.profile.salt = undefined
        question.author = request.profile
        //console.log("account", request.profile)
        question.save((err, result) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(result)
        })
    })
};

exports.questionByMember = (request, response) => {
    Question.find({ author: request.profile._id })
        .populate("author", "_id name")
        .select('_id heading body created interests')
        .sort("_created")
        .exec((err, questions) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(questions)
        })
}

exports.interest = (request, response) => {
    Question.findByIdAndUpdate(
        request.body.questionId, 
        {$push: {interests: request.body.memberId}}, 
        {new: true}
    ).exec((err, result) => {
        if(err) {
            return response.status(400).json({
                error: err
            })
        } else {
            response.status(200).json(result)
        }
    })
}

exports.nointerest = (request, response) => {
    Question.findByIdAndUpdate(
        request.body.questionId, 
        {$pull: {interests: request.body.memberId}}, 
        {new: true}
    ).exec((err, result) => {
        if(err) {
            return response.status(400).json({
                error: err
            })
        } else {
            response.status(200).json(result)
        }
    })
}

exports.answer = (request, response) => {
    let answer = request.body.answer
    answer.author = request.body.memberId
    Question.findByIdAndUpdate(
        request.body.questionId, 
        {$push: {answers: answer}}, 
        {new: true}
    )
    .populate("answers.author", "_id name")
    .populate("author", "_id name")
    .exec((err, result) => {
        if(err) {
            return response.status(400).json({
                error: err
            })
        } else {
            response.status(200).json(result)
        }
    })
}

