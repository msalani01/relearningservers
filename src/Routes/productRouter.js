const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ProductManager = require('../../dao/ProductManager');

const productsRouter = express.Router();
const productManager = new ProductManager("products.json");

// Ruta 
productsRouter.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validación
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails.' });
    }

    // Genera un id 
    const productId = uuidv4();

    // Crea producto
    const newProduct = {
        id: productId,
        title,
        description,
        code,
        price,
        status: true, 
        stock,
        category,
        thumbnails: thumbnails || [], 
    };

    const socketServer = req.app.get('socketServer');

    // Agrega el nuevo producto 
    const addedProduct = productManager.addProduct(newProduct);

    socketServer.io.emit('updateProducts', productManager.getProducts());


    // Devuelve el producto
    if (addedProduct) {
        res.status(201).json(addedProduct);
    } else {
        res.status(500).json({ error: 'Error al agregar el producto.' });
    }
});

// Ruta obtener  productos
productsRouter.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
    res.json(products);
});

// Ruta para obtener un producto por su ID
productsRouter.get('/:productId', (req, res) => {
    const productId = req.params.productId;
    const producto = productManager.getProductById(productId);

    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta para actualizar un producto
productsRouter.put('/:productId', (req, res) => {
    const productId = req.params.productId;
    const updatedFields = req.body;

    // Actualiza el producto y obtén el producto actualizado
    const updatedProduct = productManager.updateProduct(productId, updatedFields);

    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta para eliminar
productsRouter.delete('/:productId', (req, res) => {
    const productId = req.params.productId;
    const deletedProduct = productManager.deleteProduct(productId);

    if (deletedProduct) {
        res.json({ message: 'Producto eliminado correctamente.' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = productsRouter;
