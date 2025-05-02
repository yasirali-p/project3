const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Basic route to respond to GET requests
app.get('/', (req, res) => {
  res.send('Hy, Hello,World,welcome node.js app!!!');
});

// Example of a POST route
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received successfully', data });
});

// Example of a dynamic route with parameters
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ID is: ${userId}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
