"use strict";

const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000
require('dotenv').config()



mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb est connecter: ${conn.connection.host}`);
  }catch (error){
    console.log(error)
    process.exit(1);
  } 
}
connectDB().then(() =>{
  app.listen(PORT, () => {
    console.log(`Le serveur écoute sur le port ${PORT}`);
  });
})




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
// route /admin
app.use('/admin', routes.routes);
// route /
app.use(routes.routes);


app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page introuvable !' });
});



// const password = process.env.DB_PASSWORD;
// const encodedPassword = encodeURIComponent(password);
// const uri = `mongodb+srv://ChipieMaster:${encodedPassword}@cluster0.nw5ggjy.mongodb.net/mydatabase?retryWrites=true&w=majority`;

// // Set up Mongoose connection
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//   console.log('La connexion à la base de données est établie, http://localhost:3000')

//   app.listen(3000, () => {
//     console.log('Le serveur écoute sur le port 3000');
//   });
// })
//     .catch(err => console.log('Error connecting to MongoDB Atlas:', err.message));

