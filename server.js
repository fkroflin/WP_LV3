const express = require('express');
const path = require('path');
const app = express();

// Middleware to log requests for debugging
app.use((req, res, next) => {
    console.log(`Request for: ${req.url}`);
    next();
});

// Serve script.js and other root-level files
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }
    },
    caseSensitive: false,
    strict: false
}));

// Serve everything in /public at the root (/, /style, /images, /public/filmtv_movies.csv)
app.use('/', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.csv')) {
            res.setHeader('Content-Type', 'text/csv');
        }
    }
}));

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});