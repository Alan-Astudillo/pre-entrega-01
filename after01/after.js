import express from "express";
import mongoose from "mongoose";
import exphbs from "express-handlebars";

const app = express();
const PORT = 8080;

mongoose.connect("mongodb://localhost:27017/tu_basede_datos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const Message = mongoose.model("Message", messageSchema);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.json());

app.use(express.static("public"));

app.get("/chat", async (req, res) => {
  try {
    const messages = await Message.find();
    res.render("chat", { messages });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

app.post("/chat", async (req, res) => {
  const { user, message } = req.body;

  try {
    const newMessage = new Message({ user, message });
    await newMessage.save();
    res.redirect("/chat");
  } catch (error) {
    res.status(400).json({ error: "Error al enviar el mensaje" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
