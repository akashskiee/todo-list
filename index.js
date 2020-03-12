const express = require("express");
const bodyParser = require("body-parser");
const getDate = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
    name: "First Item"
});

const item2 = new Item ({
    name: "Second item"
});

const defaultItems = [item1, item2];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("list", listSchema);

year = getDate.getYear();

app.get("/", (req, res) => {

    Item.find({}, (err, result) => {
        if(result.length === 0){
            Item.insertMany(defaultItems, (err) => {
                if(err){
                    console.log(err);                    
                } else {
                    console.log("Successfully added");                    
                }
                res.redirect("/");
            });
        } else{
                day = getDate.getDate();
                res.render('list', {listType: day, year: year, newListItems: result});    
        }
    });

    
});

app.post("/", (req, res) => {
    const newItem = req.body.newItem;
    console.log(newItem);
    const item = new Item({
        name: newItem
    });
    item.save();
    res.redirect("/");
});

app.get("/:listType", (req,res) => {
    const listName = req.params.listType;

    List.find({listName}, (err, results) => {
        results.forEach(result => {
        const testName = result.name;
        
        if(testName != listName){
            const list = new List({
                name: listName,
                items: defaultItems
            });
        
            list.save();
        } else {
            console.log(testName)
        }
    });
    });

        
});


app.post("/delete", (req, res) => {
    const id = req.body.checkbox;

    Item.findByIdAndRemove(id, {useFindAndModify: false}, (err) => {
        if(err) {
            console.log(err);            
        } else {
            res.redirect("/");
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port);
});