const express = require('express');
const app = express();

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Example endpoint for n8n
app.post('/process', (req, res) => {
  const data = req.body;

  console.log('Received from n8n:', data);

  // Do something with data
  const result = {
    message: "Processed successfully",
    input: data
  };

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});