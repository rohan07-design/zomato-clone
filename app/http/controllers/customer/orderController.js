const Order = require("../../../models/order")
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
                req.flash('success','Order Placed Successfully..!!')
                delete req.session.cart
                res.redirect('/customer/orders')
            }).catch(err => {
                console.log(err)
                req.flash('error','Something went wrong..!!')
                return res.redirect('/cart')
            })
        },
        async index(req,res) {
            const orders =  await Order.find({
                customerId: req.user._id
            },null,{ sort: { 'createdAt' : -1}})
            res.header('Cache-Control','no-cache, private, no-store, must-relative,max-stale=0, post-check=0, pre-check=0')
            res.render('customer/orders',{
                orders:orders,
                moment:moment
            })
        },
        async show(req,res) {
            const order = await Order.findById(req.params.id)
            // Autherized the user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customer/singleOrder',{ order: order})
            } 
            return res.redirect('/')
        }
    }
}

module.exports = orderController