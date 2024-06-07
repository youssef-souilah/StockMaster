const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require("./routes/index");

app.use("/", indexRouter);




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});