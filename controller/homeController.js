const Menu = require("../model/menu")

const homeController = {

    async index(req,res){
        const menus = await Menu.find();
        // console.log(menus)
        res.render('home',{menus : menus})
    }
}

module.exports = homeController;