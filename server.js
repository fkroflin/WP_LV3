const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    console.log(`Request for: ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }
    },
    caseSensitive: false,
    strict: false
}));

app.use('/', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.csv')) {
            res.setHeader('Content-Type', 'text/csv');
        }
    }
}));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});