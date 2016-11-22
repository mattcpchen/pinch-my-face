'use strict';

var app = require('./app')();

app.listen(app.get('port'), function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server up ===> http://localhost:' + app.get('port'));
});