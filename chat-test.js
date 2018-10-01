const express = require('express');
const app = express();

app.use(express.static('js'));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/chat.html');
  });

app.listen(3007, function () {
    console.log('Example app listening on port 3007!');
  });