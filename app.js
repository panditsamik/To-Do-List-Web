const express = require("express")
const app = express()

const port = 3000;

const ejs = require("ejs");

const bodyParser = require("body-parser");

var listitems = ["A cup of tea in the morining", "Charger", "Mobile Phone & Power-Bank"];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var date = new Date().toLocaleTimeString('en-us', options);
    res.render("list", {arr : listitems, day: date});
    
})

app.listen(port, (req, res)=>{
    console.log("Server running on port :" + port);
});

app.post("/", function(req, res){
    let item = req.body.newItem;
    listitems.push(item);
    res.redirect("/");
});