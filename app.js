"use strict";

const path = require('path');
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config()



mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDb est connecter: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`server is running`, "http://localhost:3000");
  });  
});




// Configuration pour template EJS
app.set('view engine', 'ejs');
// Déclarer le dossier views qui contient les templates
// app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

// Déclaration d'un parser pour analyser "le corps (body)" d'une requête entrante avec POST  
// Permet donc d'analyser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

// Importe les routes
const routes = require('./routes/routes');

// Utilisation des routes en tant que middleware
app.use(cors());
// route /admin
app.use('/admin', routes.routes);
// route /
app.use(routes.routes);


app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page introuvable !' });
});



