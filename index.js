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

year = getDate.getYear();

app.get("/", (req, res) => {

    Item.find({}, (err, result) => {
        if(err){
            console.log(err);        
        } else{
                day = getDate.getDate();
                res.render('list', {listType: day, year: year, newListItems: result});    
        }
    });

    
});

app.post("/", (req, res) => {
    var newItem = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(workItem);
        res.redirect("/");
    } else {
    items.push(newItem);
    res.redirect("/");
    }
});

//Test without routing the action page for performance

app.get("/work", (req,res) => {
    
    res.render('list', {listType: "Work List", year: year, newListItems: workItems});
});

app.post("/work", (req, res) => {
    var workItem = req.body.newItem;
    workItems.push(workItem);
    res.redirect("/work");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port);
});