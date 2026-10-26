const express = require('express');
const morgan = require('morgan');
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting...`);
        cluster.fork();
    });
} else {
    const app = express();
    app.use(morgan('dev'));

    app.get('/', (_req, res) => {
        for (let i = 0; i < 1000000000; i++) {
        }
        res.send('Hello Mine');
    });

    app.listen(4000, () => {
        console.log(`Stress Server is running on http://localhost:4000 in worker ${process.pid}`);
    });
}