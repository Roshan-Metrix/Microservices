const autocannon = require('autocannon');

const urls = ['http://localhost:5000/stress-test', 'http://localhost:5000/main'];

const runBenchmark = (url) =>
  new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url,
        connections: 10,
        duration: 30,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (err, result) => {
        if (err) {
          console.error(`Autocannon failed for ${url}:`, err);
          reject(err);
          return;
        }

        console.log(`Results for ${url}:`);
        console.log('Total requests in duration:', result.requests.total);
        resolve(result);
      }
    );

    process.once('SIGINT', () => {
      instance.stop();
    });
  });

(async () => {
  await Promise.all(
    urls.map(async (url) => {
      console.log(`Running benchmark for ${url}...`);
      await runBenchmark(url);
    })
  );
})().catch((err) => {
  console.error('Benchmark run failed:', err);
  process.exitCode = 1;
});
