const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const port = 8000;

app.use(express.static(__dirname + '/../ReactScripts/'));
app.get('/', function (req, res) {
    res.sendFile("index.html");
});
routes(app);
app.listen(port);