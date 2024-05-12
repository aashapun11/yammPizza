const Order = require("../model/order");
const moment = require("moment");

const orderController = {
    store(req,res){
        const {phone, address} = req.body;
       


        if(!phone || !address){
            req.flash('error', 'All fields are required')
            return res.redirect('/cart');
        }

       
        const order = new Order({
            customerId: req.user._id,
            item: req.session.cart.item,
            phone,
            address
        })

        order.save().then(result => {
            Order.populate(result, { path: 'customerId' })
            .then((placedOrder) => {

            req.flash('success','Order Placed Successfylly')
            delete req.session.cart

            // Emit
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced', placedOrder)
            return res.redirect('/customers/orders');
            })

            
        })
       

            .catch(err =>{
            req.flash('error', "Something went wrong");
            return res.redirect('/cart')
        })
       }, 
       async index(req, res) {
        const orders = await Order.find ({ customerId: req.user._id }, 
            null,
            { sort: { 'createdAt': -1 } } )
        res.header('Cache-Control', 'no-store') 
        res.render('customers/orders', { orders: orders, moment : moment})
    },
    async show(req,res) {
        const order = await Order.findById(req.params.id);

        if(req.user._id.toString() === order.customerId.toString()){
            return res.render('customers/singleOrder',{order})
        }
        
         return  res.redirect('/');
        
    }
}

module.exports = orderController;