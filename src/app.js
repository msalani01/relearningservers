const productManager = require('./ProductManager');
const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('HOLA UWU');
});

app.get('/productos', (req, res) => {
    const productos = ProductManager.getProducts();
    res.json(productos);
});

app.listen(8080, () => console.log('Servidor en 8080'));
