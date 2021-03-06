let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

router.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author]
  })
  .then((article) => {
    if (!article) throw Error();
    
        article.getComments().then(comments => {
        // console.log(comments)
      res.render('articles/show', { article: article, comments: comments});
    })
  }).catch(error => {
    console.log(error);
    res.status(400).render('main/404');
  })
})

router.post('/:id/comments', (req,res) => {
  console.log(req)
  const post = req.body.id
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.id
  })
  res.redirect(`/articles/${post}`)
})

module.exports = router