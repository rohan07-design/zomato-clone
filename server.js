const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000

//load assest
app.use(express.static('public'));

require("./routes/web")(app)

//setting the template engine
app.use(expressLayout)
app.set("views", path.join(__dirname,"/resources/views"))
app.set("view engine","ejs");



app.get("/orderOnline",(req,res) => {
    res.render("orderOnline/orderOnline.ejs")
})



app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})