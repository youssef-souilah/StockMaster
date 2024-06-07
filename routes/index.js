const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
router.get('/products.xml', (req, res) => {
    res.sendFile(__dirname + '/data/products.xml');
});
router.get('/categories.xml', (req, res) => {
    res.sendFile(__dirname + '/data/categories.xml');
});

router.get('/populaires.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/populaires.xslt');
});
router.get('/prixeleve.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/prixeleve.xslt');
});
router.get('/basprix.xslt', (req, res) => {
    res.sendFile(__dirname + '/data/xslt/basprix.xslt');
});

module.exports = router;