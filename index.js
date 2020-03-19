const express = require("express");
const bodyParser = require("body-parser");
const getDate = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const year = getDate.getYear();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0-qnmpu.mongodb.net/test?retryWrites=true&w=majority/todolistDB`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

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
                
                res.render('list', {listType: "Today", year: year,  newListItems: result});    
        }
    });

    
});

app.post("/", (req, res) => {
    const newItem = req.body.newItem;
    const btnListname = req.body.list;

    const item = new Item({
        name: newItem
    });

    if(btnListname === "Today"){
    item.save();
    res.redirect("/");
    } else {
        List.findOne({name: btnListname}, (err, newFoundList) => {
            newFoundList.items.push(item);
            newFoundList.save();
            res.redirect("/" + btnListname);
        });
    }
});

app.get("/:listType", (req,res) => {
    const listName = _.capitalize(req.params.listType);
    
    List.findOne({name: listName}, (err, listFound) => {
        if(!err){
            if(!listFound){
                const list = new List({
                    name: listName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + listName);
            } else {
                //show an existing list  
                res.render('list', {listType: listName, year: year, newListItems: listFound.items});             
            }
        }
    });

    
});


app.post("/delete", (req, res) => {
    const id = req.body.checkbox;
    const lname = req.body.hiddenListName;

    if(lname === "Today"){
        Item.findByIdAndRemove(id, {useFindAndModify: false}, (err) => {
            if(err) {
                console.log(err);            
            } else {
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: lname}, {$pull: {items: {_id: id}}}, (err, delFoundList) => {
            if(!err){
                res.redirect("/" + lname);
            }
        });
    }
    
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port);
});