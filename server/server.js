require('./config/config')

const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Rutas
app.use(require('./routes/usuario'))

// Conexion a mongodb
mongoose.connect(process.env.urlDB, { useNewUrlParser: true }, (err, res) => {
  if (err) throw err
  console.log('Base de datos Online')
});


app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto', 3000)
})  