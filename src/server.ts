import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { sequelize } from "./sequelize";
import { V0_MODELS } from "./controllers/v0/model.index";

import { IndexRouter } from "./controllers/v0/router.index";

(async () => {
  const app = express();
  const port = process.env.PORT || 8060;

  await sequelize.addModels(V0_MODELS);
  await sequelize.sync();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/api/v0", IndexRouter);

  app.get("/", (req, res) => {
    res.send("Hello Again");
  });

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
