const express = require('express')
const app = express()

const port = 4000;


app.get('/api/river_sensor_data', (req, res) => {
  const river_sensor_data = require('./river_sensor_data.json');
  res.json(river_sensor_data)
});

app.get('/api/*', (req, res) => {
  const river_sensor_data = require('./river_sensor_data.json');
  res.send(`Path ${req.url} not found!`)
});

app.use(express.static("build"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})