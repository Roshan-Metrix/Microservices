const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`--- Captain service is running on port ${PORT} ---`)
})