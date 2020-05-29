import { Router, Request, Response } from "express";
import { User } from "../models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router: Router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  let { email, password } = req.body;

  let validate = await User.findOne({ where: { email } });

  if (validate === null) {
    await bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.status(500).send({
          error: err,
        });
      }

      let user = await User.create({
        email,
        password: hash,
      });

      res.status(201).send({
        message: "Signup Success!",
        uid: user.id,
      });
    });
  } else {
    res.status(409).send({
      message: "Email exist!",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  let { email, password } = req.body;

  let validate = await User.findOne({ where: { email } });

  if (validate !== null) {
    await bcrypt.compare(password, validate.password, (err, result) => {
      if (err) {
        res.status(401).send({
          message: "Auth fail!",
        });
      }

      if (result) {
        const token = jwt.sign(
          {
            email,
            uid: validate.id,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );

        res.status(201).send({
          message: "Signin Success",
          token,
        });
      } else {
        res.status(401).send({
          message: "Auth fail!",
        });
      }
    });
  } else {
    res.status(409).send({
      message: "Your email incorrect!",
    });
  }
});

export const UserRouter: Router = router;
