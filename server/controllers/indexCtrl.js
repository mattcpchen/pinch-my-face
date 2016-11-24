import path from 'path';


module.exports = {
  index: function(req, res) {
    const indexHtmlPath = path.join(__dirname, '../../public/index.html');
    res.sendFile(indexHtmlPath);
  }
};





