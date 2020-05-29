import { Router, Request, Response, response } from "express";
import { Product } from "../models/Product";

import fetch from "node-fetch";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const items = await Product.findAll();
  const response = {
    count: items.length,
    products: await Promise.all(
      items.map(async (item) => {
        let resp = await fetch(
          `http://localhost:8080/storage/data/${item.title}`
        );
        let json = await resp.json();

        return {
          pid: item.id,
          quantity: item.quantity,
          title: item.title,
          desc: item.desc,
          image: json.url,
          price: item.price,
          type: item.type,
        };
      })
    ),
  };

  res.status(200).send(response);
});

router.post("/", async (req: Request, res: Response) => {
  let { title, price, type, image, desc, quantity } = req.body;

  let product = await Product.create({
    title,
    desc,
    price,
    type,
    image,
    quantity,
  });

  res.status(200).send({
    message: "Create product success!",
    product,
  });
});

router.get("/:title", async (req: Request, res: Response) => {
  let { title } = req.params;

  let item = await Product.findOne({ where: { title } });

  if (item === null) {
    res.status(404).send({
      message: "Product not found!",
    });
  }

  let resp = await fetch(`http://localhost:8080/storage/data/${item.title}`);
  let json = await resp.json();

  res.status(200).send({
    pid: item.id,
    title: item.title,
    desc: item.desc,
    quantity: item.quantity,
    price: item.price,
    type: item.type,
    image: json.url,
  });
});

router.get("/type/:type", async (req: Request, res: Response) => {
  let { type } = req.params;

  let items = await Product.findAll({ where: { type } });

  if (items == null) {
    res.status(404).send({
      message: "Product not found!",
    });
  }

  const response = {
    count: items.length,
    products: await Promise.all(
      items.map(async (item) => {
        let resp = await fetch(
          `http://localhost:8080/storage/data/${item.title}`
        );
        let json = await resp.json();

        return {
          pid: item.id,
          quantity: item.quantity,
          title: item.title,
          desc: item.desc,
          price: item.price,
          type: item.type,
          image: json.url,
        };
      })
    ),
  };

  res.status(200).send(response);
});

router.patch("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let { quantity } = req.body;

  await Product.update(
    { quantity },
    {
      where: { id },
    }
  );

  res.status(200).send({
    message: "Update Success!",
  });
});

export const ProductRouter: Router = router;
