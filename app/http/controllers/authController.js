const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')


function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
    return {
        login(req, res) {
            res.render("auth/login.ejs")
        },
        logout(req,res) {
            req.logout((err) => {
                if(err) {
                    return next(err)
                }
            })
            return res.redirect('/login')
        },
        postLogin(req,res,next) {
            const {email, password } = req.body

            if (!email || !password) {
                req.flash("error1", "All fields are empty")
                return res.redirect("/login")
            }
            passport.authenticate('local',(err,user,info) => {
                console.log("Error: "+err)
                console.log("User: "+user)
                console.log("Info: "+info)
                if(err) {
                    req.flash("error1",info.message)
                    return next(err)
                }

                if(!user) {
                    req.flash("error1",info.message)
                    return res.redirect('/login')
                }

                req.logIn(user,(err) => {
                    if(err) {
                        req.flash("error1",info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
        },
        register(req, res) {
            res.render("auth/register.ejs")
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                req.flash("error", "All fields are empty")
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect("/register")
            }
            //check the email exists
            User.exists({ email: email }, (err, result) => {
                //if email is already exist
                if (result) {
                    req.flash("error", "Email already taken")
                    req.flash('name', name)
                    req.flash('email', email)
                    // alert("Email is already exist")
                    return res.redirect('/register')
                }
            })

            //hashed password
            const hashedPassword = await bcrypt.hash(password, 10)

            //create the user
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            console.log(name, email, password)

            user.save().then((user) => {
                return res.redirect("/")
            }).catch(err => {
                req.flash('error','Something went wrong')
                return res.redirect("/register")
            })
        }
    }
}

module.exports = authController