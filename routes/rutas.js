import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;

// Conectar a la base de datos MongoDB
mongoose.connect(
  "mongodb+srv://ecommerce:<password>@cluster0.pngosrs.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

// Definir el esquema y modelo para productos
const productoSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  code: String,
  precio: Number,
  status: Boolean,
  stock: Number,
  categoria: String,
});

const Producto = mongoose.model("Producto", productoSchema);

// ... (similarmente, puedes definir un esquema y modelo para carritos)

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Ejemplo de datos simulados (en lugar de una base de datos real)
const productos = [];

// Manejo de productos
const productosRouter = express.Router();

// Ruta raíz para listar todos los productos con límite opcional
productosRouter.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener un producto por ID
productosRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const producto = await Producto.findOne({ id: pid });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta para agregar un nuevo producto
productosRouter.post("/", async (req, res) => {
  const { id, title, description, code, precio, stock, categoria } = req.body;

  try {
    const nuevoProducto = new Producto({
      id,
      title,
      description,
      code,
      precio,
      status: true, // Status por defecto es true
      stock,
      categoria,
    });
    await nuevoProducto.save();
    res.json({
      message: "Nuevo producto agregado",
      nuevoProducto,
    });
  } catch (error) {
    res.status(400).json({ error: "Error al agregar el nuevo producto" });
  }
});

// ... (resto del código para actualizar y eliminar productos)

// Iniciamos el servidor
app.use("/api/productos", productosRouter);

// ... (similarmente, puedes configurar rutas y modelos para carritos)

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
