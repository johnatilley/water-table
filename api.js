const express = require('express');
const path = require("path");
const cors = require('cors');
const fs = require("fs");
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/river_sensor_data', cors(), (req, res) => {
  const river_sensor_data = require('./river_sensor_data.json');
  res.json(river_sensor_data);
});

// Any api route that doesn't exist will return a not found
app.get('/api/*', cors(), (req, res) => {
  res.status(404).json({ error: { message: `Path ${req.url} not found!` } });
});

// Every other route goes to react which will handle any 404s
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(__dirname, 'build/index.html'))) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  } else {
    // If the react app hasn't been build then send the Wordpress db error message to mess with the hackers
    res.status(404).send(`<h1>Error establishing a database connection</h1>`);
  }
});

const port = process.env.API_PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});