const http = require('http');

const host = '127.0.0.1';
const port = 4000;

// This server just exists so that we can simulate a real API server for the river sensor data
// and not mix the json file in with our react source files.
const server = http.createServer((req, res) => {
  if (req.url === '/api/river_sensor_data') {
    const river_sensor_data = require('./river_sensor_data.json');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(river_sensor_data));
  } else {
    res.statusCode = 404;
    res.end(`Path ${req.url} not found!`);
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
