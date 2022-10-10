function cartController() {
    return {
        index(req,res) {
            res.render("cartPage/cart.ejs")
        }
    }
}

module.exports = cartController