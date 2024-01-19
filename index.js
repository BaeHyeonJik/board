var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

//create
(async () => {
await Comments.sync();
})();
// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  const comments = await Comments.findAll(); //find
  res.render('index', {comments: comments});
});

app.post('/create', async function(req, res) {
  console.log(req.body)
  const {content} = req.body
  await Comments.create({content: content}); //create
  res.redirect('/')
});

//update
app.post('/update/:id', async function(req, res) {
  const {id} = req.params
  const {content} = req.body
  await Comments.update({content: content}, {
    where: {
      id: id
    }
  });
  res.redirect('/')
});

//delete
app.post('/delete/:id', async function(req, res) {
  const {id} = req.params
  await Comments.destroy({
    where: {
      id: id
    }
  });
  res.redirect('/')
});

app.listen(8080);
console.log('Server is listening on port 8080');