const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customer/cartController")
const adminOrderController = require("../app/http/controllers/admin/orderController")
const orderController = require("../app/http/controllers/customer/orderController")

//middlewares authentication
const guest = require("../app/http/middleware/guest")
const auth = require("../app/http/middleware/auth")
const admin = require("../app/http/middleware/admin")


function nonLayoutRoutes(app) {
    app.get("/", homeController().index)

    app.get("/cart",cartController().index)

    app.get("/login", guest, authController().login)
    app.post("/login", authController().postLogin)

    app.get("/register", guest, authController().register)
    app.post("/register",authController().postRegister)

    app.post('/logout', authController().logout)

    app.post("/update-cart", cartController().update)

    //customer route
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)

    //Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)

}

module.exports = nonLayoutRoutes
