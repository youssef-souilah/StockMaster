const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var productRouter = require("./routes/product");    
var categoryRouter = require("./routes/category");    

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/products.xml', (req, res) => {
    res.sendFile(__dirname + '/data/products.xml');
});
app.get('/categories.xml', (req, res) => {
    res.sendFile(__dirname + '/data/categories.xml');
});

app.get('/populaires.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/populaires.xslt');
});
app.get('/prixeleve.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/prixeleve.xslt');
});
app.get('/basprix.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/basprix.xslt');
});
app.use("/products", productRouter);
app.use("/categories", categoryRouter);




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});