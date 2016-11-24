import express from 'express';
import path from 'path';
var router = express.Router();



// static
router.use(express.static(__dirname + '/../public'));
router.use(express.static(__dirname + '/../dist'));

// index
// router.get('*', _index);
router.get('/', _renderIndex);
router.get('/upload/:pname', _renderIndex);





module.exports = router;




function _renderIndex(req, res) {
  const indexHtmlPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexHtmlPath);
}
