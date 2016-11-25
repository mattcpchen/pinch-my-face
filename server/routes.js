import express from 'express';
import indexCtrl from './controllers/indexCtrl';
import photoCtrl from './controllers/photoCtrl';
const router = express.Router();


// static
router.use(express.static(__dirname + '/../public'));
router.use(express.static(__dirname + '/../dist'));

// index
// router.get('*', _index);
router.get('/', indexCtrl.index);


// photo
router.post('/upload_api/clear', photoCtrl.clearTmpFolder);
router.post('/upload_api/upload', photoCtrl.uploadPhoto);




module.exports = router;