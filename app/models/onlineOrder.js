const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    foodname: {
        type:String, required:true
    },
    foodtype: {
        type:String, required:true
    },
    price :{
        type:Number, required:true
    },
    image :{
        type:String, required:true
    }
})

module.exports = mongoose.model('OnlineOrder', menuSchema)