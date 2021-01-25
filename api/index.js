//importar archivos ddentro de node require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//mis rutas
const meals = require('./routes/meals');
const orders = require('./routes/orders');
const auth = require('./routes/auth');

//Creando app dde express
const app = express();

//metodo de use para app / agregando plugins a nuestro server de express para darle funcionalidad
app.use(bodyParser.json());
app.use(cors());

//conectandonos a mongodb, 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mensaje a cualquier ruta que acceda
app.use('/api/meals', meals);
app.use('/api/orders', orders);
app.use('/api/auth', auth);

//exportando
module.exports = app

// almuerzi-db
// chanchitoFeliz
// SyE123qwezxc
// app.listen(3000)