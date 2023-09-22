const Order = require("../../../models/order")
const moment = require('moment')
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orderController() {
    return {
        store(req, res) {
            console.log(process.env.STRIPE_PRIVATE_KEY)
            //validate request
            // console.log(req.body)
            // return
            const { phone, address, stripeToken} = req.body
            const PaymentType = req.body.paymentType
           
            if (!phone || !address) {
                return res.status(422).json({ success: 'Order Placed Successfully..!!' })
                // req.flash('error', 'All fields are required')
                // return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: req.body.phone,
                address: req.body.address
            })

            // console.log(phone, address, `Order id:${order.customerId}`, order.items)

            order.save().then(result => {

                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // console.log("placedOrders: ",placedOrder)
                    // req.flash('success', 'Order Placed Successfully..!!')
                    //stripe payment
                    debugger
                    if (PaymentType === 'card') {
                        // console.log("Enters in card section")
                        // console.log("Total price is: ",req.session.cart.totalPrice)
                        const payment = stripe.paymentIntents.create({
                            name: req.user._id,
                            amount: req.session.cart.totalPrice *100,
                            currency: 'usd',
                            // source: stripeToken,
                            description: `Food Order: ${placedOrder._id}`
                        }).then(() => {
                            console.log("success orders")
                            placedOrder.paymentStatus = true;
                            placedOrder.payment = "Card"
                            placedOrder.save().then((ord) => {
                                // console.log("The orders are",ord)
                                //emit
                                const eventEmitter = req.app.get('event')
                                eventEmitter.emit('OrderPlaced', ord)
                                delete req.session.cart
                                console.log("before payment")
                                return res.json({ success: 'Payment sucessfull, Order Placed Successfully..!!' })
                            }).catch((err) => {
                                // console.log('Error in card section')
                            })
                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message: 'Payment Failed, order placed successfully..!! You can pay at delivery time'})
                        })
                    } 
                    res.redirect('/customer/orders')    
                })
            }).catch(err => {
                return res.json({ message: 'something went wrong'})
                // console.log(err)
                // req.flash('error', 'Something went wrong..!!')
                // return res.redirect('/cart')
            })},
                async index(req, res) {
                const orders = await Order.find({
                    customerId: req.user._id
                }, null, { sort: { 'createdAt': -1 } })
                res.header('Cache-Control', 'no-cache, private, no-store, must-relative,max-stale=0, post-check=0, pre-check=0')
                res.render('customer/orders', {
                    orders: orders,
                    moment: moment
                })
            },
        async show(req, res) {
                const order = await Order.findById(req.params.id)
                // Autherized the user
                if (req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customer/singleOrder', { order: order })
                }
                return res.redirect('/')
            }
        }
    }

    module.exports = orderController