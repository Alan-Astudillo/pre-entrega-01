import app from "./app.js";
import dotenv from "dotenv";
import { PORT } from "./config/indexconf.js";

dotenv.config();

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
