const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const expJwt = require('express-jwt');
const Member = require("../models/member");

// Member registration, login and logout

exports.register = async (request, response) => {
    const memberExists = await Member.findOne({ email: request.body.email })
    if(memberExists) return response.status(403).json({
        error: "This email is already registered. Please use a different email."
    })
    const member = await new Member(request.body)
    await member.save()
    response.status(200).json({ message: "You have successfully registered. Please log into your account."})
}

exports.login = (request, response) => {
    const {email, password} = request.body
    Member.findOne({email}, (err, member) => {
        if(err || !member) {
            return response.status(401).json ({
                error: "We couldn't a find member with that email. Please register."
            })
        }
        if(!member.authenticate(password)) {
            return response.status(401).json({
                error: "This email and password do not match. Please try again."
            })
        }
        const token = jwt.sign({_id: member._id}, process.env.JWT_SECRET);
        response.cookie("t", token, {expire: new Date() + 9999})
        const {_id, name, email} = member;
        return response.json({token, member: {_id, email, name}});

    })
};

exports.logout = (request, response) => {
    response.clearCookie("t");
    return response.status(200).json({message: "You have successfully logged out."});
}

exports.isLoggedin = expJwt ({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
})

exports.hasPermission = (request, response) => {
    const permission = 
    request.profile && request.auth && request.profile._id === request.auth._id
    if(!permission) {
        return response.status(403).json({
            error: "No permission."
        });
    }
}

// Member validation 
exports.regValidation = (request, response, next) => {
    request.check("name", "Please make sure you have added your name").notEmpty();
    request.check("email", "Please add an email which is between 5 and 50 characters")
    .matches(/^[^@]+@[^@]+\.[^@]+$/)
    .withMessage("Please make sure your email is correct and try again.")
    .isLength({
        min: 4,
        max: 50
    })
    request.check('password')
    .isLength({ min: 5, max: 50 })
    .withMessage("Password add a password which is between 5 and 50 characters.")
    const errors = request.validationErrors();
    if (errors) {
        const isError = errors.map((error) => error.msg)[0];
        return response.status(400).json({error: isError})
    }
    next();

}

// Member CRUD methods

exports.memberById = (request, response, next, id) => {
    Member.findById(id).exec((err, member) => {
        if(err || !member) {
            return response.status(400).json ({
                error: "Sorry, we couldn't match this member."
            })
        }
        request.profile = member
        next()
    })
}

exports.getAllMembers = (request, response) => {
    Member.find((err, members) => {
        if (err) {
            return response.status(400).json({
                error: err
            })
        }
        response.status(200).json(members);
    }).select("name email updated created")
}

exports.getAMember = (request, response) => {
    request.profile.hash = undefined
    request.profile.salt = undefined
    return response.json(request.profile);
}

exports.updateMember = (request, response, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(request, (err, fields, files) => {
        if(err) {
            return response.status(400).json({
                error: "This image could not uploaded. Please ensure the image is less than 500kb."
            })
        }
        let member = request.profile
        member = _.extend(member, fields)
        member.updated = Date.now()
        if(files.photo) {
            member.photo.data = fs.readFileSync(files.photo.path)
            member.photo.contentType = files.photo.type
        }
        member.save((err, result) => {
            if(err) {
                return response.status(400).json({
                    error: err
                })
            }
            member.hash = undefined
            member.salt = undefined
            response.status(200).json(member);
        })
    })
}

exports.memberImage = (request, response, next) => {
    if(request.profile.photo.data)  {
        response.set("Content-Type", request.profile.photo.contentType)
        return response.send(request.profile.photo.data)
    } 
    next() 
}

exports.deleteMember = (request, response) => {
    let member = request.profile;
    member.remove((err, member) => {
        if(err) {
            return response.status(400).json({
                error: err
            })
        }
        response.status(200).json({message: "This member has been successfully removed."})
    })
}