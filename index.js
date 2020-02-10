const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    var today = new Date();
    var currentDay = today.getDay();
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    res.render('list', {kindofDay: day[currentDay]});
});

app.post("/", (req, res) => {

});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});