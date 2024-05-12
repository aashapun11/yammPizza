const cartController = {
    index(req,res){
        res.render('customers/cart')
    },
    update(req,res){
        // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
// session ma cart wala section nai xaina vhane 1st of all session ma cart ko key define garne
        if(!req.session.cart){
            req.session.cart = {
                item : {},
                totalQty : 0,
                totalPrice : 0
            }
        }

        let cart = req.session.cart;
//hamile rakhne wala item cart ma 1st time add garddai xau vhane just item name pani dina paryo
        if(!cart.item[req.body._id]){
            cart.item[req.body._id] = {
                item : req.body,
                qty : 1
            }
            cart.totalQty += 1,
            cart.totalPrice += req.body.price
        }else{ // cart ma add garna lako item already xa vhane just quantity ra price matra add gare vhayo
            cart.item[req.body._id].qty += 1;
            cart.totalQty += 1,
            cart.totalPrice += req.body.price
        }

        return res.json({totalQty : req.session.cart.totalQty})
         
    
    }
}

module.exports = cartController;