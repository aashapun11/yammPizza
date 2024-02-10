const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const ejs = require("ejs");
const path = require("path");


app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.get('/', (req,res)=>{
    res.render("home");
})

app.listen(port,()=>{
    console.log(`Listening to the port ${port}`)
})