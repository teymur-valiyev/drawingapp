var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require("ejs-locals");
var passport = require('passport');
var mongoose = require('mongoose');
var session = require("express-session");

//  cixianda chatdan bildrish disconnect mumi chat typing ???  node app stata cevirmek artiq kodu silmek  canvas kordinat sonra
// yann panel reng size temiz silmek
//room yaratmaq prinsize
var debug = require('debug')('firstapp:server');
var http = require('http');


var configDB = require('./config/database.js');

mongoose.connect(configDB.connect);

var routes = require('./routes/index');

var app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


var server = http.createServer(app);
var io = require('socket.io').listen(server);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


var usernames = {};
var userimages = {};

io.sockets.on('connection', function (socket) {
    console.log('connection server');

    //socket.on('join', function(data) {
    //  console.log(data);
    //});


    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.emit('updatechat', socket.username, data);
    });

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function (userimg) {
        userid = app.locals.userinfo.id;
        username = app.locals.userinfo.name;
        socket.username = userid;
        usernames[userid] = username;
        userimages[userid] = userimg;
        data = {
            userid: userid,
            username: username,
            profileimg: userimg,
            message: 'you have connected!'
        }
        socket.emit('updatechat', 'SERVER', data);

        data.message = username + ' have connected!';
        socket.broadcast.emit('updatechat', username, data);

        io.sockets.emit('updateusers', usernames);
    });

    socket.on('isdrawing', function (data) {
        //console.log('server side drawing: '+data);
        socket.broadcast.emit('draw_shape', data);

    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global usernames list
        // update list of users in chat, client-side
        var userimg = userimages[socket.username];
        var userid = socket.username;

        io.sockets.emit('updateusers', usernames);

        data = {
            userid: userid,
            username: username,
            profileimg: userimg,
            message: 'has disconnected!'
        }

        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'bosh', data);
        delete usernames[socket.username];
        delete userimages[socket.username];

    });
});

//


// view engine setup
app.engine("ejs", engine);
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: "tank and spank",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//login middle ware login informationlar

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    if (req.isAuthenticated()) {
        res.locals.user = req.user;

        app.locals.userinfo = {
            id: req.user.facebook.id,
            name: req.user.facebook.name
        };
        //app.locals.userinfo = req.user.facebook.id;
        //app.locals.username = req.user.facebook.id;
        //app.locals.usersurname = req.user.facebook.id;
        //app.locals.userinfo = {
        //  id: req.user.facebook.id,
        //  displayname: req.user.facebook.displayname,
        //  firstname: req.user.facebook.firstname,
        //  lastname: req.user.facebook.lastname
        //}
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


