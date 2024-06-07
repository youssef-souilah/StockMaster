const express = require("express");
const router = express.Router();
const xml2js = require('xml2js');
const fs = require('fs');
const path = require("path");
router.delete('/delete/:id', (req, res) => {
    const filePath = path.join(__dirname, '../data/categories.xml');
    fs.readFile(filePath, (err, data) => {
        if (err) res.status(500).json({
            message:"une erreur se produit ! (file notfound)"
        });
        xml2js.parseString(data, (err, result) => {
            if (err) res.status(500).json({
                message:"une erreur se produit ! (file reader)"
            });
            
            const id=req.params.id
            if(id==null){
                res.status(400).json({
                    message:"paramètre manquant !"
                });
            }
            let categories = result.Categories.Category;

            categories = Categories.filter(category => category.$.id != id);

            result.Categories.Category = categories;

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            fs.writeFile(filePath, xml, (err) => {
                if (err) res.status(500).json({
                    message:"une erreur se produit ! (file writer)"
                });
                res.status(200).json({
                    message:"category supprimé avec succès"
                });
            });
        });
    });
});
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../data/categories.xml');
    fs.readFile(filePath, (err, data) => {
        if (err) res.status(500).json({
            message:"une erreur se produit !"
        });
        xml2js.parseString(data, (err, result) => {
            if (err) res.status(500).json({
                message:"une erreur se produit !"
            });
            
            
            let categories = result.Categories.Category;

            

            res.status(200).json({
                message:"success",
                data:categories
            });
            
        });
    });
});

module.exports = router;