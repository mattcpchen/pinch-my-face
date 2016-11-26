import express from 'express';
import path from 'path';
import indexCtrl from './controllers/indexCtrl';
import photoCtrl from './controllers/photoCtrl';
const router = express.Router();


// static
router.use(express.static( path.join(__dirname, '../public/') ));
router.use(express.static( path.join(__dirname, '../dist/') ));

// index
// router.get('*', indexCtrl.index);
router.get('/', indexCtrl.index);


// photo
router.post('/upload_api/clear', photoCtrl.clearTmpFolder);
router.post('/upload_api/upload', photoCtrl.uploadPhoto);




module.exports = router;