const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/todoDB');
const port = 3000;

const ejs = require("ejs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

// Mongoose

const itemsSchema = new mongoose.Schema(
    {
        name: String
    }
)

const Item = mongoose.model("Item", itemsSchema);
const item1 = Item(
    {
        name: "A cup  of tea in the morning"
    }
)

const item2 = Item(
    {
        name: "Charger"
    }
)

const item3 = Item(
    {
        name: "Mobile Phone & Power-Bank"
    }
)

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var date = new Date().toLocaleTimeString('en-us', options);


    Item.find({})
        .then(foundItems => {
            if (foundItems.length == 0) {
                return Item.insertMany(defaultItems);
            } else {
                return foundItems;
            }
        })
        .then(items => {
            res.render("list", { arr: items, day: date });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/delete", function (req, res) {
    const checkedId = req.body.checkbox;
    Item.findByIdAndDelete(checkedId)
        .then(() => {
            console.log("Successfully deleted item");
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
})


app.listen(port, (req, res) => {
    console.log("Server running on port :" + port);
});

app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    const item = new Item({ name: itemName });
    item.save();
    res.redirect("/");
});

