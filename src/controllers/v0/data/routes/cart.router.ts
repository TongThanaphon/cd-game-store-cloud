import { Router, Response, Request } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

const router: Router = Router();

router.get("/:uid", async (req: Request, res: Response) => {
  let { uid } = req.params;

  const items = await Cart.findOne({ where: { uid, status: "looking" } });

  if (items === null) {
    res.status(404).send({
      message: "Product not found!",
    });
  }

  let index = 0;
  const response = {
    uid,
    status: items.status,
    products: await Promise.all(
      items.pids.map(async (pid) => {
        let { title, price } = await Product.findByPk(pid);
        let quantity = await items.quantities[index];

        index += 1;
        return {
          pid,
          title,
          quantity,
          price,
        };
      })
    ),
  };

  res.status(200).send(response);
});

router.post("/", async (req: Request, res: Response) => {
  let { uid, pids, quantities, status } = req.body;

  const cart = await Cart.findOne({ where: { uid } });

  if (cart === null) {
    const created = await Cart.create({
      uid,
      pids,
      quantities,
      status,
    });

    res.status(200).send(created);
  } else {
    await Cart.update(
      { pids, quantities },
      {
        where: { uid },
      }
    );

    res.status(200).send({
      message: "Update Cart!",
    });
  }
});

router.patch("/:uid", async (req: Request, res: Response) => {
  let { uid } = req.params;
  let { pids, quantities, status } = req.body;

  await Cart.update(
    { pids, quantities, status },
    { where: { uid, status: "looking" } }
  );

  let index = 0;
  await Promise.all(
    pids.map(async (pid: number) => {
      let { quantity } = await Product.findOne({ where: { id: pid } });
      let qty = quantity - quantities[index];

      index += 1;
      if (qty < 0) {
        res.status(404).send({
          message: "Quantity out of stock!",
        });
      }

      await Product.update({ quantity: qty }, { where: { id: pid } });
    })
  );

  res.status(200).send({
    message: "Purchase!",
  });
});

router.delete("/:uid", async (req: Request, res: Response) => {
  let { uid } = req.params;

  await Cart.destroy({ where: { uid } });

  res.status(200).send("Delete Success!");
});

export const CartRouter: Router = router;
