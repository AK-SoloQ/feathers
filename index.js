const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const memory = require('feathers-memory');

var mongoose = require('mongoose');
var bodyParser = require('body-parser')

const logger = require('morgan');
const router = express.Router();
var cors = require('cors');


//Upload Files Models
var multer = require('multer');
const fileType = require('file-type')
const fs = require('fs')

//body
//Security Helmet &  server session
var helmet = require('helmet');
var session = require('express-session');


// Creates an Express compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register a messages service with pagination
app.use('/messages', memory({
    paginate: {
        default: 100,
        max: 250
    }
}));
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection => app.channel('everybody').join(connection));
// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));


// Settings for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    https: //stackoverflow.com/questions/21987311/check-is-nodejs-connection-come-from-localhost
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});
app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use(logger('dev'));

router.options('*', cors())
app.use('/api/v1', router);
app.use('/static', express.static('public/images'))
app.use('/', router);

// Helmet configuration
app.use(helmet());
app.use(session({
    secret: '"AljkdsfiKORKDK089953çà_ç¦¨´¨É¸¸ÆªØËªªRR39kkdkj5321$*"',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))



router.get('/', function (req, res, next) {
    res.writeHead(200,{'Content-Type':'text/html'});
        fs.readFile('./index.html',null,function(error, data){
        if(error){
            res.writeHead(404);
            res.write('file not found!')
        }else{
            res.write(data);
        }
        //res.end();
    })
    //res.end();
});



// Start the server
app.listen(3030).on('listening', () =>
    console.log('Feathers server listening on localhost:3030')
);