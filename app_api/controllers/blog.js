const _ = require('lodash');
const Blog = require('../models/blog')
const formidable = require('formidable');
const fs = require('fs');

exports.blogById = (request, response, next, id) => {
    Blog.findById(id)
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .exec((err, blog) => {
            if (err || !blog) {
                return response.status(400).json({
                    error: err
                })
            }
            request.blog = blog
            next()
        });
}

exports.isBlogAuthor = (request, response, next) => {
    let isBlogAuthor = request.blog && request.auth && request.blog.author._id == request.auth._id
    // console.log("request.blog: ", request.blog);
    // console.log("request.auth: ", request.auth);
    // console.log("request.blog.author._id : ", request.blog.blogBy._id);
    // console.log("request.auth._id : ", request.auth._id);
    if (!isBlogAuthor) {
        return response.status(403).json({
            error: "No access."
        })
    }
    next()
}

exports.updateBlog = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields, files) => {
        if(err) {
            return response.status(400).json({
                error: "This image could not be uploaded. Please ensure the image is less than 500kb."
            })
        }
        let blog = request.blog;
        blog = _.extend(blog, fields)
        blog.updated = Date.now()
        if(files.photo) {
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }
        blog.save((err, result) => {
            if(err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(blog);
        })
    })
}

exports.deleteBlog = (request, response) => {
    let blog = request.blog
    blog.remove((err, blog) => {
        if (err) {
            return response.status(400).json({
                error: err
            })
        }
        response.status(200).json({
            message: "This blog has been successfully deleted."
        })
    })
};

exports.blogImage = (request, response) => {
response.set("Content-Type", request.blog.photo.contentType)
    return response.send(request.blog.photo.data);
}

exports.blog = (request, response) => {
    return response.json(request.blog);
}

exports.getAllBlogs = (request, response) => {
    const blogs = Blog.find()
        .populate("author", "_id name")
        .populate("answers", "content created")
        .populate("answers.author", "_id name")
        .select('_id heading body created')
        .sort({ created: -1 })
        .then((blogs) => {
            response.json(blogs);
        })
        .catch(error => console.log(error));
};

exports.createBlog = (request, response) => {
    let formReq = new formidable.IncomingForm()
    formReq.keepExtensions = true
    formReq.parse(request, (err, fields, files) => {
        if (err) {
            return response.status(400).json({
                error: "This image could not be uploaded. Please ensure the image is less than 500kb."
            })
        }
        let blog = new Blog(fields)
        request.profile.hash = undefined
        request.profile.salt = undefined
        blog.author = request.profile
        //console.log("PROFILE", request.profile)

        if (files.photo) {

            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }
        blog.save((err, result) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(result)
        })
    })
};

exports.blogByMember = (request, response) => {
    Blog.find({ author: request.profile._id })
        .populate("author", "_id name")
        .select('_id heading body created')
        .sort("_created")
        .exec((err, blogs) => {
            if (err) {
                return response.status(400).json({
                    error: err
                })
            }
            response.status(200).json(blogs)
        })
}

exports.answer = (request, response) => {
    let answer = request.body.answer
    answer.author = request.body.memberId
    Blog.findByIdAndUpdate(
        request.body.blogId, 
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

