const express = require('express');
const proxy = require('express-http-proxy')
const morgan = require('morgan')

const app = express();
app.use(morgan('dev'));

app.use('/stress-test', proxy('http://localhost:4000'));
app.use('/main', proxy('http://localhost:3000'));

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
})