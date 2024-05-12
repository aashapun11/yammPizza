const Order = require("../../model/order")

const orderController = {
    
        index(req, res) {
            
           Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password')
           .then((orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('admin/orders')
               }
           })
        }
    
}

module.exports = orderController