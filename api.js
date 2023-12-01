const express = require('express');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/river_sensor_data', (req, res) => {
  const river_sensor_data = require('./river_sensor_data.json');
  res.json(river_sensor_data);
});

// Any api route that doesn't exist will return a not found
app.get('/api/*', (req, res) => {
  res.status(404).json({ error: { message: `Path ${req.url} not found!` } });
});

// Every other route goes to react which will handle any 404s
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});