const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const db = require('./db');

const app = express();

const port = 3000;

const JWT_SECRET = 'jwt_secret_key';

// Middleware
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// authenticate user
const authUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ Error: 'No user is currently logged in!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);

      if (err.name === 'TokenExpiredError') {
        res.clearCookie('token');
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ Error: 'Invalid token: ' + err.message });
    }

    req.user_id = decoded.user_id;

    // Proceed to the next middleware if token is valid
    next();
  });
};


// get authenticcated user's data
const getUserData = (req, res, next) => {
  const userId = req.user_id;

  const sqlQuery = 'SELECT * FROM users WHERE id = ?';
  db.query(sqlQuery, [userId], (err, data) => {
    if (err) {
      console.error('Error during DB query:', err);
      return res.status(500).json({ Error: 'Server authentication error!' });
    }

    if (data.length === 0) {
      return res.status(404).json({ Error: 'User not found!' });
    }

    req.user = data[0]; // Store the user in req object
    next(); // Proceed to the route handler
  });
};

const authenticate = [authUser, getUserData];

// Route to authenticate user
app.get('/authenticate', authenticate, (req, res) => {
  res.json({ message: 'User authenticated', user: req.user });
});


// =============================================================================================================

function checkProductFavStatus(product) {

};

// Get all products from DB
app.get('/products', authenticate, (req, res) => {

  const sqlQuery = 'SELECT * FROM products;';

  db.query(sqlQuery, (err, data) => {

    if (err) {

      console.error('Error during DB query:', err);
      return res.json({ error: 'Error fetching products from database !' });

    } else {

      const products = data;
      return res.json({ products: products });
    }
  });
});

// ================================================================================================================

// Handle CMS login
app.post('/cms', (req, res) => {
  console.log('Request received:', req.body);

  const sqlQuery = 'SELECT * FROM users WHERE username = ?';

  db.query(sqlQuery, [req.body.username], (err, data) => {
    if (err) {
      console.error('Error during DB query:', err);
      return res.json({ error: 'Server authentication error!' });
    }

    if (data.length > 0) {
      if (req.body.username !== data[0].username || req.body.password !== data[0].pass) {
        return res.json({ error: 'Username/password do not match existing records!' });
      }

      if (data[0].isAdmin !== 'true') {
        return res.json({ error: 'Your account does not have access to this service!' });
      }

      // Generate JWT token and send it to the client
      const user = data[0];
      const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', token);

      return res.json({ status: 'success', token: token, user: user.username, message: "Credentials accepted!" });
    } else {
      return res.json({ error: 'Invalid credentials!' });
    }
  });
});

// Add a new product in the CMS
app.post('/cms/add-product', (req, res) => {
  const selectQuery = 'SELECT * FROM products WHERE product_name = ?';
  const product_name = req.body.product_name.toLowerCase();
  const price = req.body.price;

  // Check if item already exists
  db.query(selectQuery, [product_name], (err, data) => {
    if (err) {
      console.error('Error during DB query:', err);
      return res.json({ Error: 'MYSQL error!' });
    }

    if (data.length > 0) {
      return res.json({ Error: 'Item already exists!' });
    } else {
      const insertQuery = 'INSERT INTO products (product_name, price) VALUES (?, ?)';

      db.query(insertQuery, [product_name, price], (err, data) => {

        if (err) {

          console.error('Error during DB query:', err);
          return res.json({ Error: 'MYSQL error!' });
        }


        return res.json({ Status: 'success' });
      });
    }
  });
});

// delete product from CMS

app.delete('/cms/remove-product/:id', (req, res) => {

  const productId = req.params.id;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';

  db.query(deleteQuery, [productId], (err, data) => {

    if (err) {

      return res.json({ Error: 'Error during DB query: ' + err });
    }

    if (data.affectedRows === 0) {
      return res.json({ Error: 'Product ID not found !' + productId.id });
    }

    return res.json({ Message: 'Product removed successfully !' })
  });
});

// edit product from CMS
app.put('/cms/edit-product/:id', (req, res) => {

  const productId = req.params.id;
  const updatedPrice = req.body.price;

  const updateQuery = 'UPDATE products SET price = ? WHERE id = ?';

  db.query(updateQuery, [updatedPrice, productId], (err, data) => {

    if (err) {

      return res.json({ Error: 'Error during DB query: ' + err });
    }

    if (data.affectedRows === 0) {
      return res.json({ Error: 'Product ID not found !' + productId.id });
    }

    return res.json({ Message: 'Product edited successfully !' })
  });

});

// ================================================================================================================

// register new user
app.post('/register', (req, res) => {

  console.log(req.body);

  const newUser = req.body;

  // check if username and email already exist
  const selectQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';

  db.query(selectQuery, [newUser.username, newUser.email], (err, data) => {

    if (err) {
      console.error('MYSQL error: ' + err)
      return res.json({ error: "Database error !" });
    }

    if (data.length > 0) {
      let errors = [];

      // Check if the username or email already exists
      if (data.some(row => row.username === newUser.username)) {
        errors.push({ message: 'Username already exists. ' });
      }
      if (data.some(row => row.email === newUser.email)) {
        errors.push({ message: 'Email already exists.' });
      }

      return res.status(400).json({ error: errors });
    }

    // insert new user into DB
    const insertQuery = 'INSERT INTO users (username, email, pass, isAdmin) VALUES (?, ?, ?, "false");'

    db.query(insertQuery, [newUser.username, newUser.email, newUser.password], (err, data) => {

      if (err) {
        console.error('MYSQL error: ' + err)
        return res.json({ error: "Registration failed due to a database error !" });
      }

      return res.json({ status: 'success', message: 'Registration successful. User added to the database !' + data.affectedRows });

    });

  });

});

// login user to main app
app.post('/login', (req, res) => {
  console.log('Request received:', req.body);

  const sqlQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(sqlQuery, [req.body.email], (err, data) => {
    if (err) {
      console.error('Error during DB query:', err);
      return res.status(500).json({ error: 'Server authentication error!' });
    }

    if (data.length === 0) {
      return res.status(400).json({ error: 'No account registered under these credentials!' });
    }

    if (req.body.email !== data[0].email || req.body.password !== data[0].pass) {
      return res.status(400).json({ error: 'Username/password do not match existing records!' });
    }

    // Generate JWT token and send it to the client
    const user = data[0];
    const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token);
    return res.status(200).json({ status: 'success', token: token, user: user.username, message: "Login successful !" });
  });
});


// logout

app.get('/logout', (req, res) => {

  res.clearCookie('token');
  res.json({ status: 'success' });

})

function selectFavProductsData(favProducts) {
  return new Promise((resolve, reject) => {
    let favProductsList = [];
    const selectQuery = 'SELECT * FROM products WHERE id = ?';

    // Use Promise.all to handle multiple asynchronous operations
    const queries = favProducts.map(favProduct => {
      return new Promise((resolveQuery, rejectQuery) => {
        db.query(selectQuery, [favProduct.product_id], (err, data) => { // Ensure product_id is correct
          if (err) {
            console.error('Error querying product:', err);
            rejectQuery(err);
          } else if (data && data.length > 0) { // Check if data is not empty
            favProductsList.push(data[0]); // Push the first product, assuming there is only one match
            resolveQuery();
          } else {
            resolveQuery(); // Resolve even if no data is found for the given ID
          }
        });
      });
    });

    // Wait for all queries to complete
    Promise.all(queries)
      .then(() => resolve(favProductsList))
      .catch(err => reject(err));
  });
}

app.get('/favourites', authenticate, async (req, res) => {
  const userId = req.user.id;

  const sqlQuery = 'SELECT * FROM favourites WHERE user_id = ?';

  db.query(sqlQuery, [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching favourites:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    try {
      // Wait for selectFavProductsData to finish
      const finalResults = await selectFavProductsData(results);

      console.log('Final Results:', finalResults);

      return res.json({ favourites: finalResults });
    } catch (error) {
      console.error('Error retrieving favourite products:', error);
      return res.status(500).json({ error: 'Failed to retrieve favourite products' });
    }
  });
});

app.delete('/favourites/delete/:id' , authenticate, (req, res) => {

  const favProductId = req.params.id;

  const deleteQuery = 'DELETE FROM favourites WHERE user_id = ? AND product_id = ?;';

  db.query(deleteQuery, [req.user.id, favProductId], (err, data) => {

    if (err) {

      return res.json({ error: 'Error during DB query: ' + err });
    }

    if (data.affectedRows === 0) {
      return res.json({ error: 'Product ID not found !' + favProductId });
    }

    return res.json({ message: 'Product removed successfully !' })
  });


});

app.post('/favourites/add', authenticate, (req, res) => {
  const product = req.body;

  console.log(product);

  const insertQuery = 'INSERT INTO favourites (user_id, product_id) VALUES (?, ?);';

  db.query(insertQuery, [req.user.id, product.id], (err, data) => {

    if (err) {

      return res.status(500).json({ error: 'Database error' });

    }

    return res.json({ message: 'Added the following items to favourites:', favourites: product });
  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
