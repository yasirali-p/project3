const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to respond to GET requests
app.get('/', (req, res) => {
  res.send('Hi, Hello World! Welcome to the Node.js app!');
});

// POST route example
app.post('/data', (req, res) => {
  const data = req.body;
  res.status(200).json({
    message: 'Data received successfully',
    data: data
  });
});

// Dynamic route with URL parameter
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.status(200).json({
    message: `User ID is: ${userId}`
  });
});

// Start server listening on 0.0.0.0 so it can be accessed externally
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
