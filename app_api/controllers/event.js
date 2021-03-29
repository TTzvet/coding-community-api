const _ = require('lodash');
const Event = require('../models/event')
const formidable = require('formidable');
const fs = require('fs');

exports.eventById = (request, response, next, id) => {
    Event.findById(id)
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .exec((err, event) => {
            if (err || !event) {
                return response.status(400).json({
                    error: err
                })
            }
            request.event = event
            next()
        });
}

exports.isAuthor = (request, response, next) => {
    let isAuthor = request.event && request.auth && request.event.author._id == request.auth._id
    // console.log("request.event: ", request.event);
    // console.log("request.auth: ", request.auth);
    // console.log("request.event.author._id : ", request.event.eventBy._id);
    // console.log("request.auth._id : ", request.auth._id);

    if (!isAuthor) {
        return response.status(403).json({
            error: "No access."
        })
    }
    next()
}

exports.updateEvent = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields) => {
        let event = request.event;
        event = _.extend(event, fields)
        event.updated = Date.now()
        event.save((err, result) => {
            if(err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(event);
        })
    })
}

exports.deleteEvent = (request, response) => {
    let event = request.event
    event.remove((err, event) => {
        if (err) {
            return response.status(400).json({
                error: err
            })
        }
        response.status(200).json({
            message: "This event has been successfully deleted."
        })
    })
};

exports.event = (request, response) => {
    return response.json(request.event);
}

exports.getAllEvents = (request, response) => {
    const events = Event.find()
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .select('_id heading body created interests')
        .sort({ created: -1 })
        .then((events) => {
            response.json(events);
        })
        .catch(error => console.log(error));
};

exports.createEvent = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields, files) => {
        let event = new Event(fields)

        request.profile.hash = undefined
        request.profile.salt = undefined
        event.author = request.profile
        //console.log("PROFILE", request.profile)
        event.save((err, result) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(result)
        })
    })
};

exports.eventByMember = (request, response) => {
    Event.find({ author: request.profile._id })
        .populate("author", "_id name")
        .select('_id heading body created interests')
        .sort("_created")
        .exec((err, events) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(events)
        })
}

exports.interest = (request, response) => {
    Event.findByIdAndUpdate(
        request.body.eventId, 
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
    Event.findByIdAndUpdate(
        request.body.eventId, 
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


