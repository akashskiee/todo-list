const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
var items = [];

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    var day = today.toLocaleDateString('en-IN', options);

    res.render('list', {kindofDay: day, newListItems: items});
});

app.post("/", (req, res) => {
    var newItem = req.body.newItem;
    items.push(newItem);
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port);
});