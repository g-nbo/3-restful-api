const express = require('express');
const router = express.Router();
//Importing the data from our fake database file
const users = require('../data/users.js');
const posts = require('../data/posts.js');

//////////////////
// BASE PATH
// - /api/users
//////////////////

// Creating a GET route for the entire users database.
// This would be impractical in larger data sets.
// GET /api/users
router.get('/', (req, res) => {
  const links = [
    {
      href: 'users/:id',
      rel: ':id',
      type: 'GET',
    },
  ];

  res.json({ users, links });
});

// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
// GET /api/users/:id
router.get('/:id', (req, res, next) => {
  const user = users.find((u) => u.id == req.params.id);

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

  if (user) res.json({ user, links });
  else next();
});

router.get('/:id/posts', (req, res) => {
  const newArr = []
  

  posts.forEach(element => {
    if(element.userId == req.params.id) {
      newArr.push(element)
    }

  });
  if (newArr.length > 0) {
    res.json(newArr);
  } else {
    res.send("Couldn't find that users post")
  }
  
})



//Creating a User (POST)
// POST /api/users
router.post('/', (req, res) => {
  // Within the POST request route, we create a new
  // user with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.name && req.body.username && req.body.email) {
    if (users.find((u) => u.username == req.body.username)) {
      res.json({ error: 'Username Already Taken' });
      return;
    }

    const user = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    };

    users.push(user);
    res.json(users[users.length - 1]);
  } else next(error(400, 'Insufficient Data'));
});

// PATCH /api/users/:id
router.patch('/:id', (req, res) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      // iterating through the user object and updating each property with the data that was sent by the client
      for (const key in req.body) {
        users[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (user) res.json(user);
  else next();
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  // The DELETE request route simply removes a resource.
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      users.splice(i, 1);
      return true;
    }
  });

  if (user) res.json(user);
  else next();
});

module.exports = router;