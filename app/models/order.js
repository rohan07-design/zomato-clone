const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    customerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items : {
        type: Object
    },
    phone : {
        type: String
    },
    address : {
        type: String
    },
    Payment : {
        type: String,
        default:"cash"
    },  
    paymentStatus : {
        type: Boolean,
        default: false
    },
    status : {
        type: String,
        default: 'Order_Placed'
    }
}, { timeStamps:true})

module.exports = mongoose.model('Order',orderSchema)