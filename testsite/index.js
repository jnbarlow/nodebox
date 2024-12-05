const express = require('express');
const app = express();
const Nodebox = require('nodebox-framework').Nodebox;

const nodeBox = new Nodebox({loglevel:'debug'});

app.use(nodeBox.getMiddleware());

// Listen to port 3000
app.listen(3000, function () {
    console.log('Dev app listening on port 3000!');
});