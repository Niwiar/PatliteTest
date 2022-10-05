const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.flash('page', 'home')
    res.render('index.ejs')
})

router.get('/code', (req, res) => {
    req.flash('page', 'code')
    res.render('code.ejs')
})

module.exports = router