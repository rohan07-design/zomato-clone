const  Order = require("../../../models/order")
const moment = require('moment')

function orderController() {
    return {
        store(req,res) {
            //validate request
            const { phone, address} = req.body
            if(!phone || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: req.body.phone,
                address: req.body.address
            }) 

            console.log(phone,address, `Order id:${order.customerId}`, order.items)

            order.save().then(result => {
                req.flash('success','Order Placed Successfully')
                res.redirect('/')
            }).catch(err => {
                console.log(err)
                req.flash('error','Something went wrong..!!')
                return res.redirect('/cart')
            })
        },
        async index(req,res) {
            const orders =  await Order.find({
                customerId: req.user._id
            })
            res.render('customer/orders',{
                orders:orders,
                moment:moment
            })
        }
    }
}

module.exports = orderController