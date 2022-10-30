require("dotenv").config()
const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require('express-flash')
const passport = require('passport')

const MongoDbStore = require('connect-mongo')(session);
const toastr = require('express-toastr');
const Emitter = require('events')

//connection to the database
const url = "mongodb://localhost/zomato"
mongoose.connect(url)
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database Connected..!!")
}).on('error',(err) => {
    console.log("Connection failed..!!")
})

//session store
let sessionStored = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})


//event emitter
const eventEmitter = new Emitter()
app.set('event',eventEmitter)

//session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store: sessionStored,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24} //24hrs
}))

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

app.use(flash())
app.use(toastr())
//load assest
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//global middleware


require("./routes/web")(app)

//setting the template engine
app.use(expressLayout)
app.set("views", path.join(__dirname,"/resources/views"))
app.set("view engine","ejs");


//onlineOrderModule
const OnlineOrder = require("./app/models/onlineOrder")
app.get("/orderOnline",(req,res) => {
    OnlineOrder.find().then(function(foodproducts) {
        return res.render("orderOnline/orderOnline.ejs",
        {
            foodProducts:foodproducts
        })
    })
})



const server = app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})

// //socket

const io = require('socket.io')(server)
io.on('connection',(socket) => {
    //join
    socket.on('join',(roomName) => {
        socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('orderUpdated',data) 
})

eventEmitter.on('orderPlaced',(data) => {
    io.to('adminRoom').emit('orderPlaced',data)
})