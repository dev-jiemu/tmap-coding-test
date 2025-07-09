const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/upload-poi', (req, res, next) => {

})

router.get('/api/upload-poi', (req, res, next) => {

})

module.exports = router;
