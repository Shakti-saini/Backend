const express = require('express');
const bodyParser = require('body-parser')
const validator = require('express-joi-validation').createValidator({ passError: true })
const cors = require('cors');
const path = require('path');
require('dotenv').config()
const app = express();
app.use(cors());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit :'100mb'}))

app.use('/apidoc', express.static(path.join(__dirname, '/apidoc/doc')));
require('./api/routes')(app, validator);
/**Db Require */
let connectDB = require('./api/lib/db');
connectDB()
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({ status: false, message: err.error.message, data: null });
    }
    next()
});

app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}!`)
});




