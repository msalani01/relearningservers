const ProductManager = require('./ProductManager');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('HOLA');
});

app.get('/products', (req, res) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;


    const productManager = new ProductManager("products.json");


    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();

    res.json(products);
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    // Crea una instancia de ProductManager con la ruta correcta
    const productManager = new ProductManager("products.json");

    // Obtén el producto por ID
    const producto = productManager.getProductById(productId);

    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


app.listen(8080, () => console.log('Servidor en 8080'));
