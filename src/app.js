const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser'); // Middleware para procesar JSON en las solicitudes
const ProductManager = require('./ProductManager');
const productRouter = require('./Routes/productRouter'); 
const cartRouter = require('./Routes/cartRouter'); 
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');



const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIO(server);

app.engine('handlebars', exphbs.engine({
    defaultLayout: false // Desactiva el uso de layouts por defecto
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


io.on('connection', (socket) => {
    console.log('Usuario conectado');
    
    // Manejar eventos de WebSocket aquí
});

// Después de agregar o eliminar un producto
io.emit('updateProducts', getProductList());



// Middleware para procesar JSON en las solicitudes
app.use(bodyParser.json());

// Crea una instancia única de ProductManager al inicio de la aplicación
const productManager = new ProductManager("products.json");

const socketServer = { io };

app.set('socketServer', socketServer);

module.exports = { socketServer };

// Rutas para la gestión de productos
const productsRouter = express.Router();

// Ruta POST para agregar un nuevo producto
productsRouter.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails.' });
    }

    // Genera un id único para el nuevo producto
    const productId = uuidv4();

    // Crea el nuevo producto
    const newProduct = {
        id: productId,
        title,
        description,
        code,
        price,
        status: true, // Status por defecto es true
        stock,
        category,
        thumbnails: thumbnails || [], // Si no se proporciona thumbnails, se establece como un array vacío
    };

    // Agrega el nuevo producto al ProductManager
    const addedProduct = productManager.addProduct(newProduct);

    // Devuelve el producto recién agregado
    if (addedProduct) {
        res.status(201).json(addedProduct);
    } else {
        res.status(500).json({ error: 'Error al agregar el producto.' });
    }
});

// Agrega el router de productos a /api/products
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
    const productManager = new ProductManager("products.json");
    const products = productManager.getProducts();
    res.render('home', { products });
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

app.get('/realtimeproducts', (req, res) => {
    const products = getProductList(); // Asegúrate de obtener la lista de productos de tu lógica
    res.render('realTimeProducts', { products });
});


app.listen(8080, () => console.log('Servidor en 8080'));

function getProductList() {
    const productManager = new ProductManager("products.json");
    return productManager.getProducts();
}