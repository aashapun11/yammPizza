const express = require("express");
const router = express.Router();

const homeController = require("../controller/homeController");
const authController = require("../controller/authController");
const cartController = require("../controller/customers/cartController");
const orderController = require("../controller/orderController");
const adminOrderController = require("../controller/admin/orderController");
const statusController = require("../controller/admin/statusController");

router.get('/', homeController.index); //done

//Middleware 
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth")
const admin = require("../app/http/middlewares/admin")

// Auth Controller
router.get('/login', guest, authController.login);
router.post('/login', authController.postLogin);

router.get('/register', guest, authController.register);
router.post('/register', authController.postRegister);

router.get('/logout', authController.logout);

//Auth Controller ******************//

// Cart Controller
router.get('/cart', cartController.index)
router.post('/update-cart', cartController.update)
// Cart Controller*****************///

// Customer routes
router.post('/orders',auth, orderController.store)
router.get('/customers/orders',auth, orderController.index)
router.get('/customer/orders/:id', auth, orderController.show)


//Adming routes
router.get('/admin/orders', admin, adminOrderController.index)
router.post('/admin/order/status', admin, statusController.update)



module.exports = router;