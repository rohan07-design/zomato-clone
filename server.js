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

app.use(flash())
app.use(toastr())
//load assest
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extend:false}))
app.use((req,res,next) => {
    res.locals.session = req.session
    next()
})

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



app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})