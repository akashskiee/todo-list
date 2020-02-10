const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    var today = new Date();

    if(today.getDay() == 1){
        res.send("Its the weekend!");
    } else {
        res.send("Ohh no! I have work")
    }
});

app.post("/", (req, res) => {

});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});