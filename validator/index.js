exports.createPostValidator = (req, res, next) => {
    req.check('title', "Please add a title").notEmpty();
    req.check('title', "Please add a title that is between 5 and 150 characters").isLength({
        min: 5,
        max: 150
    });
    req.check('body', "Please add a body text").notEmpty();
    req.check('body', "Please add body text that is between 15 and 1500 characters").isLength({
        min: 15,
        max: 1500
    });
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error: firstError})
    }
    next();
};