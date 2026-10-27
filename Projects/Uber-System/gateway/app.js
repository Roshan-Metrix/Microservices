const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

app.get('/', (req, res)=>{
    res.send('This is Gatway Server.')
})

app.use('/user',expressProxy('http://localhost:3001'));

app.use((req, res, next) => {
    res.send('Not Found!');
})

app.listen(3000, () => {
    console.log('Gateway Server is listening on port 3000')
})