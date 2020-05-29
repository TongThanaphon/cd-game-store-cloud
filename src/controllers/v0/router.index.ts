import { Router } from "express";

import { UserRouter } from "./user/routes/user.router";
import { ProductRouter } from "./data/routes/product.router";
import { CartRouter } from "./data/routes/cart.router";

const router: Router = Router();

router.use("/users", UserRouter);
router.use("/products", ProductRouter);
router.use("/carts", CartRouter);

export const IndexRouter: Router = router;
