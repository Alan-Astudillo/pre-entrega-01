import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 8080;
const PRODUCTOS_FILE = "productos.json";
const CARRITOS_FILE = "carritos.json";

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Ejemplo de datos simulados (en lugar de una base de datos real)
let productos = [];
let carritos = [];

// Función para generar un ID único
function generarIdUnico() {
  return Math.random().toString(36).substr(2, 9);
}

// Cargar datos desde archivos JSON (si existen)
async function cargarDatos() {
  try {
    const productosData = await fs.readFile(PRODUCTOS_FILE, "utf-8");
    const carritosData = await fs.readFile(CARRITOS_FILE, "utf-8");
    productos = JSON.parse(productosData) || [];
    carritos = JSON.parse(carritosData) || [];
  } catch (error) {
    console.error("Error al cargar datos:", error.message);
  }
}

// Guardar datos en archivos JSON
async function guardarDatos() {
  try {
    await fs.writeFile(
      PRODUCTOS_FILE,
      JSON.stringify(productos, null, 2),
      "utf-8"
    );
    await fs.writeFile(
      CARRITOS_FILE,
      JSON.stringify(carritos, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error al guardar datos:", error.message);
  }
}

// Inicializar la carga de datos al iniciar el servidor
cargarDatos();

// Manejo de carritos
const cartsRouter = express.Router();

// Ruta raíz para listar todos los carritos
cartsRouter.get("/", (req, res) => {
  res.json(carritos);
});

// Ruta para crear un nuevo carrito
cartsRouter.post("/", (req, res) => {
  const nuevoCarrito = {
    id: generarIdUnico(),
    products: [],
  };

  carritos.push(nuevoCarrito);

  // Guardar datos después de agregar un nuevo carrito
  guardarDatos().then(() => {
    res.json({
      message: "Nuevo carrito creado",
      nuevoCarrito,
    });
  });
});

// Ruta para obtener los productos de un carrito por ID
cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;

  const carrito = carritos.find((c) => c.id === cid);

  if (carrito) {
    res.json(carrito.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Ruta para agregar un producto al carrito
cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const carrito = carritos.find((c) => c.id === cid);

  if (carrito) {
    const productoExistente = carrito.products.find(
      (p) => p.product.id === pid
    );

    if (productoExistente) {
      productoExistente.quantity += 1;
    } else {
      const nuevoProducto = {
        product: {
          id: pid,
        },
        quantity: quantity || 1,
      };

      carrito.products.push(nuevoProducto);
    }

    // Guardar datos después de modificar un carrito
    guardarDatos().then(() => {
      res.json({
        message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
        carritoActualizado: carrito,
      });
    });
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Agregamos el router de carritos a la ruta /api/carts
app.use("/api/carts", cartsRouter);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
