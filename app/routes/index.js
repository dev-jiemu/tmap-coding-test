const express = require('express');
const router = express.Router();
const multer = require('multer');
const indexController = require('../controllers/indexController');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10 * 1024 * 1024} // 10MB 제한
});

/* GET home page. */
router.get('/index', function (req, res, next) {
    res.render('index', {
        title: 'Express',
    });
});

/* GET script data */
router.get('/getScript', indexController.getScript);

/* excel import */
router.post('/api/upload-poi', upload.single('poiFile'), indexController.uploadPoi)

/* poi list get */
router.get('/api/poi-list', indexController.getPoiList)

module.exports = router;
