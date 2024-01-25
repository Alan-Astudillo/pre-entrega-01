import router from "../controllers/controllers.carts.js";
import router from "../controllers/controllers.products.js";

const router = (app) => {
  app.use("/products", productsController);
  app.use("/carts", cartController);
  //app.use('/', viewsController)
};

export default router;
