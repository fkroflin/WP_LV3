const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(cors()); // Dodaj CORS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Pozdrav sa Railway servera!');
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});