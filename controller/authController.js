const passport = require("passport");
const User = require("../model/user")
const bcrypt = require('bcrypt');
// const { info } = require("laravel-mix/src/Log");

const authController = {

    login(req,res){
        res.render("auth/login")
    },

    postLogin(req,res,next){
        const { email, password }   = req.body
        // Validate request 
         if(!email || !password) {
             req.flash('error', 'All fields are required')
             return res.redirect('/login')
         }
        passport.authenticate('local', (err, user, info)=>{
            if(err){
                req.flash('error', info.message)
                return next(err);
            }
            if(!user){
                req.flash('error', info.message)
                return res.redirect('/login');
            }
            // Store cart items in temporary variable
            const cartItems = req.session.cart || [];
            req.session.cart = null; // Clear cart items from session

            req.logIn(user, (err)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err);

                }
                // Restore cart items to session
                req.session.cart = cartItems;
                if(req.user.role === 'admin'){
                return res.redirect('/admin/orders');
                } else{
                    return res.redirect('/customers/orders');
                }
            })
        })(req,res,next)
    },
    register(req,res){
        res.render("auth/register")
    },
    async postRegister(req,res){
        const {name, email, password} = req.body;

        // validating the request
        if(!name || !email || !password){
            req.flash('error', 'All fields are mandatory');
            req.flash('name' , name)
            req.flash('email', email)
            return res.redirect('/register');
        }

        // check if email already exits
        try {
            const emailExits = await User.findOne({ email});
            if(emailExits) {
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email) 
            return res.redirect('/register');
            }       
         }catch(err){
         console.log(err);
         }


        /*Create a user*/
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password : hashedPassword
        })

        user.save().then((user)=>{
            //Login operation after login
            return res.redirect('/');
        }).catch(err=>{
            req.flash('error', 'Something went Wrong');
            return res.redirect('/register')
        })
    },
    logout(req, res) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/login');
          });

        }
}

module.exports = authController;