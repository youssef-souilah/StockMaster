const express = require("express");
const router = express.Router();
const xml2js = require('xml2js');
const fs = require('fs');
router.delete('/delete/:id', (req, res) => {
    fs.readFile('../data/products.xml', (err, data) => {
        if (err) res.status(500).json({
            message:"une erreur se produit !"
        });
        xml2js.parseString(data, (err, result) => {
            if (err) res.status(500).json({
                message:"une erreur se produit !"
            });
            
            const id=req.params.id
            if(id==null){
                res.status(400).json({
                    message:"paramètre manquant !"
                });
            }
            let products = result.Products.Product;

            products = products.filter(product => product.$.id != id);

            result.Products.Product = products;

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            fs.writeFile('../data/products.xml', xml, (err) => {
                if (err) res.status(500).json({
                    message:"une erreur se produit !"
                });
                res.status(200).json({
                    message:"produit créé avec succès"
                });
            });
        });
    });
});

module.exports = router;