const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



app.get('/products.xml', (req, res) => {
    res.sendFile(__dirname + '/data/products.xml');
});
app.get('/categories.xml', (req, res) => {
    res.sendFile(__dirname + '/data/categories.xml');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});