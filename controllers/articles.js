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
      article.getComments().then(comments => {
          console.log(comments);
          res.render('articles/show', {article: article, comments: comments})
      })
  })
})

router.post('/:id/comments', (req, res) => {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.articleId
  }).then(comment => {
    res.redirect(`/articles/${req.body.articleId}`);
  })
});

module.exports = router
