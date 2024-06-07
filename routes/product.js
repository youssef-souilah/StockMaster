const express = require("express");
const router = express.Router();
const xml2js = require('xml2js');
const fs = require('fs');
router.delete('/delete/:id', (req, res) => {
    fs.readFile('../data/products.xml', (err, data) => {
        if (err) throw err;

        xml2js.parseString(data, (err, result) => {
            if (err) throw err;
            const id=req.params.id
            let products = result.Products.Product;

            products = products.filter(product => product.$.id != id);

            result.Products.Product = products;

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            fs.writeFile('../data/products.xml', xml, (err) => {
                if (err) throw err;
                res.redirect('/');
            });
        });
    });
});

module.exports = router;