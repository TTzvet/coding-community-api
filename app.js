const express = require ('express');
const app = express();
const morgan = require ('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const questionRoutes = require('./app_api/routes/question');
const blogRoutes = require('./app_api/routes/blog');
const eventRoutes = require('./app_api/routes/event');
const memberRoutes = require("./app_api/routes/member");
require('./app_api/models/db');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use('/', questionRoutes);
app.use('/', blogRoutes);
app.use('/', eventRoutes);
app.use('/', memberRoutes);

app.use(function (err, request, response, next) {
    if (err.name === 'UnauthorizedError') {
        response.status(401).json({error: "You are not authorised"});
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is listening on port: ${port}`)
});