"use strict";

const express = require('express')
const router = express.Router()
const Snippets = require("../models/snippet");



// Route INDEX
router.get('/', (req, res,next) => {
  Snippets.find()
  .sort({ createdAt: -1 }) // Sort by 'createdAt' field in descending order
  .exec()
  .then(snippets => {
    console.log(snippets)
    const tagFilter = Array.from(new Set(snippets.flatMap(snippet => snippet.tags)));
    const selectedTag = req.query.tag;
    res.render('index', {
      snippet : snippets,
      pageTitle: 'Tous les snippets',
      indexTitleH1: 'Tous mes Snippets',
      tagFilter: tagFilter,
      selectedTag: selectedTag
    });
  })
  .catch(err =>{
    console.log(err)
    if(!err.statusCode){
      err.statusCode = 500
    }
  })
});


//Route GET Tags Filter
router.get('/tag/:tag', (req, res) => {
  const tag = req.params.tag;
  const selectedTag = tag; // Define the selectedTag variable with the tag value

  Snippets.find({ tags: tag })
    .sort({ createdAt: -1 })
    .exec()
    .then(snippets => {
      res.render('index', {
        snippet : snippets,
        pageTitle : `Filtré pour le tag : ${tag}`,
        indexTitleH1: `Filtré pour le tag : ${tag}`,
        selectedTag: selectedTag
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
});





// Affiche le formulaire d'ajout d'article
router.get('/add-snippet', (req, res, next) => {
  res.render('add-snippet', {
    pageTitle: 'Ajouter un article',
    errorMessage: null,
    product: {}
  });
});

// Reçoit les données du formulaire d'ajout de snippet
router.post('/add-snippet', (req, res, next) => {
  const { title, url, content, tags } = req.body;
  
 
  const tag = tags.split(' ').filter(tag => tag !== '');
  
  if (!title|| title.length > 255) {
    return res.render('add-snippet', {
      pageTitle: "Ajouter un article",
      errorMessage: "Veuillez ajouter un titre !",
      product: {
        title: title,
        url: url,
        content: content,
        tags: tags
      }
    });
  }

  const product = new Snippets({
    title: title,
    url: url,
    content: content,
    tags: tag,
  });

  // Save the document in MongoDB
  product.save()
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(err => {
      return res.render('add-snippet', {
        pageTitle: "Ajouter un article",
        errorMessage: err.errors,
        product: {
          title: title,
          url: url,
          content: content,
          tags: tags
        }
      })
    });
});


router.get('/edit-snippet/:id', (req, res, next) => {
  
  //Si le URL est vrai, le lien est poussé dans le titre du snippet et va ouvrir dans un nouvel onglet
  if (Snippets.url) {
    Snippets.title = `<a href="${Snippets.url}" target="_blank">${Snippets.title}</a>`;
  }

  //Ouvre le snippet:id pour la modification avec toutes les champs pré-remplis (voir le form dans edit-snippet.ejs)
  Snippets.findOne({ _id: req.params.id })
    
    .then(snippet => {
      if (snippet) {
        res.render('edit-snippet', {
          pageTitle: 'Modifier : ' + snippet.title,
          snippet,
          errorMessage: null
        });
      } else {
        res.redirect('/');
        
      }
    })
    .catch(err => {
      console.error(err);
      res.status(404).render('404', { pageTitle: 'Page introuvable !' });
    });

});


router.post('/edit-snippet/:id', (req, res, next) => {
  const snippetId = req.params.id;
  const { title, url, content, tags } = req.body;
  const tag = tags.split(' ').filter(tag => tag !== '');

  // Check if title is empty
  if (!title|| title.length > 255) {
    return res.render('edit-snippet', {
      pageTitle: 'Modifier : ' + title,
      snippet: {
        _id: snippetId,
        title: title,
        content: content,
        url: url,
        tags: tag,
      },
      errorMessage: 'Le titre ne peut pas être vide et doit avoir maximum 255 characters',
    });
  }

  Snippets.findByIdAndUpdate(
    snippetId,
    {
      title: title,
      url: url,
      content: content,
      tags: tag,
    },
    { new: true }
  )
    .then((result) => {
      console.log(result);
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).render('404', { pageTitle: 'Page introuvable !' });
    });
});



//route pour supprimer un snippet 
router.get('/delete-snippet/:id', (req, res, next) => {
  const snippetId = req.params.id;
  Snippets.findByIdAndRemove(snippetId)
    .then(result => {
      console.log(result);
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
});



// Export des routes pour utilisation dans app.js
exports.routes = router;


