const fs = require('fs');

class ProductManager {
  constructor(path) {
    if (!path) {
      throw new Error("Se requiere proporcionar una ruta al instanciar ProductManager.");
    }

    this.products = [];
    this.nextProductId = 1;
    this.path = path;
    this.loadProducts(); // Cargar productos existentes al instanciar la clase
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf8');
    } catch (error) {
      console.error('Error al guardar productos:', error.message);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validación de campos obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return null;
    }

    // Validación de código único
    const isCodeUnique = this.products.every(product => product.code !== code);
    if (!isCodeUnique) {
      console.error(`Ya existe un producto con el código "${code}".`);
      return null;
    }

    // Crear un nuevo producto con id autoincrementable
    const newProduct = {
      id: this.nextProductId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.saveProducts(); // Mover esta línea para que guarde después de agregar el nuevo producto
    return newProduct;
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts(); // Guardar productos después de actualizar
      return this.products[productIndex];
    } else {
      console.error(`Producto con ID "${productId}" no encontrado.`);
      return null;
    }
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts(); // Guardar productos después de eliminar
      console.log(`Producto con ID "${productId}" eliminado correctamente.`);
    } else {
      console.error(`Producto con ID "${productId}" no encontrado. No se pudo eliminar.`);
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find(product => product.id === productId);

    if (product) {
      return product;
    } else {
      console.error(`Producto con ID "${productId}" no encontrado.`);
      return null;
    }
  }
}

// Ejemplo de uso:
const myProductManager = new ProductManager("products.json");

// Agregar productos con códigos únicos
const product1 = myProductManager.addProduct("Producto 1", "Descripción del producto 1", 29.99, "/images/product1.jpg", "P001", 100);
const product2 = myProductManager.addProduct("Producto 2", "Descripción del producto 2", 39.99, "/images/product2.jpg", "P002", 50);

// Intentar agregar un producto con código repetido (debería fallar)
const product3 = myProductManager.addProduct("Producto 3", "Descripción del producto 3", 19.99, "/images/product3.jpg", "P001", 75);

// Eliminar un producto por ID
myProductManager.deleteProduct(1);

// Obtener todos los productos después de eliminar
const allProductsAfterDelete = myProductManager.getProducts();
console.log(allProductsAfterDelete);

// Obtener un producto por ID
const productById = myProductManager.getProductById(1);
console.log(productById);

// Intentar obtener un producto con un ID inexistente
const nonExistingProduct = myProductManager.getProductById(3);

// Obtener todos los productos
const allProducts = myProductManager.getProducts();

console.log(allProducts);

module.exports = ProductManager;