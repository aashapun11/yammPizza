require('dotenv').config();

const express = require("express");
const app = express();
const port = 10000 || process.env.PORT;
const ejs = require("ejs");
const path = require("path");
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require("passport");
const Emitter = require('events')




app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// to use the static path
const static_path = path.join(__dirname,"/public");
app.use(express.static(static_path))

// Database connection
require("./databse/connection")

//session config
// session works as middleware 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store : MongoDbStore.create({ mongoUrl: process.env.MONGO_URL }),
    saveUninitialized : false,  
    cookie: {maxAge : 1000 * 60 * 60 *24} //24 hours

}))
app.use(flash());

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


// To make available to session in each request
app.use(function(req,res,next) {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})




app.use('/', require("./routes/web"))



const server = app.listen(port,()=>{
    console.log(`Listening to the port ${port}`)
})

//Socket
const io = require("socket.io")(server);
io.on('connection', (socket) => {
    // Join
    // console.log(socket.id);
    socket.on('join', (orderId) => {
        // console.log(orderId)
      socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})


eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})

