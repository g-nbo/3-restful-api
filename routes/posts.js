const express = require('express');
const router = express.Router();
//Importing the data from our fake database file
const posts = require('../data/posts.js');

//////////////////
// BASE PATH
// - /api/posts
//////////////////

// Creating a GET route for the entire posts database.
// This would be impractical in larger data sets.
router.get('/', (req, res) => {
  const links = [
    {
      href: 'posts/:id',
      rel: ':id',
      type: 'GET',
    },
  ];

  res.json({ posts, links });
});

// Creating a simple GET route for individual posts,
// using a route parameter for the unique id.
router.get('/:id', (req, res, next) => {
  const post = posts.find((p) => p.id == req.params.id);

  const links = [
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'PATCH',
    },
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'DELETE',
    },
  ];

  if (post) res.json({ post, links });
  else next();
});

//Creating a Post (POST)
router.post('/', (req, res) => {
  // Within the POST request route, we create a new
  // user with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.userId && req.body.title && req.body.content) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);
    res.json(posts[posts.length - 1]);
  } else next(error(400, 'Insufficient Data'));
});

router.patch('/:id', (req, res) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      // iterating through the user object and updating each property with the data that was sent by the client
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

router.delete('/:id', (req, res) => {
  // The DELETE request route simply removes a resource.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1);
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

module.exports = router;