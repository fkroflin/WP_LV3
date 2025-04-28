const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// Poslužuje sve statične datoteke iz mape public
app.use(express.static(path.join(__dirname, 'public')));

// Osnovni endpoint
app.get('/', (req, res) => {
  res.send('Pozdrav sa Railway servera!');
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
