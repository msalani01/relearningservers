// En cartRouter.js (ubicado en la carpeta routes)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Array para almacenar los carritos (puedes utilizar una base de datos en lugar de un array en un entorno de producción)
const carts = [];

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    // Genera un id único para el nuevo carrito
    const cartId = uuidv4();

    // Crea un nuevo carrito con la estructura requerida
    const newCart = {
        id: cartId,
        products: [],
    };

    // Agrega el nuevo carrito al array de carritos
    carts.push(newCart);

    // Devuelve el carrito recién creado
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;

    // Busca el carrito por su id
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
        // Devuelve los productos del carrito si existe
        res.json(cart.products);
    } else {
        // Retorna un mensaje de error si el carrito no existe
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
  
    // Buscar el carrito por su ID
    const cart = carts.find(cart => cart.id === cartId);
  
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }
  
    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find(product => product.product === productId);
  
    if (existingProduct) {
      // Incrementar la cantidad si el producto ya está en el carrito
      existingProduct.quantity += quantity || 1;
    } else {
      // Agregar el producto al carrito como un nuevo objeto
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }
  
    res.status(200).json(cart);
  });

module.exports = router;
