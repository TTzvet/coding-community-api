const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// alt db connection use mongodb://localhost/nodeapi
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database Connected'));

mongoose.connection.on('error', err => {
    console.log(`Database connection error: ${err,message}`);
});

const postRoutes = require('./routes/post');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Nodejs API is listening on port: ${port}`)
});