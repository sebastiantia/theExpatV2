import { Router } from "express";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../models/User";
import { redis } from "../utils/redis";
import { v4 } from "uuid";
import argon2 from "argon2";
import { auth } from "../utils/auth";
import { getConnection } from "typeorm";

export const router = Router();

router.get("/me", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.json("no user");
    return;
  }

  const user = await User.findOne({ id: req.session.userId });

  if (!user) {
    res.json("no user");
    return;
  }

  res.json({ user });
});

router.post("/login", async (req, res): Promise<void> => {
  const { email }: { email: string } = req.body;

  const unhashed = v4();

  const hashed = await argon2.hash(unhashed);

  await redis.set(email, hashed, "ex", 600);

  await sendEmail({
    recipient: email,
    subject: "Expat Login",
    body: `<div>Login to The Expat</div><a href="${
      process.env.NODE_ENV === "production"
        ? process.env.API_URL
        : "http://localhost:4000"
    }/api/v1/user/confirm?email=${encodeURIComponent(
      email
    )}&token=${unhashed}">${
      process.env.NODE_ENV === "production"
        ? process.env.API_URL
        : "http://localhost:4000"
    }/api/v1/user/confirm?email=${encodeURIComponent(
      email
    )}&token=${unhashed}</a>`,
  });

  res.json({ email });
});

router.get("/confirm", async (req, res): Promise<void> => {
  const email = req.query.email as string;
  const token = req.query.token as string;

  //validate them later.
  if (!token || !email) {
    res.json({ error: "unauthorized" });
    return;
  }

  const foundToken = await redis.get(email);

  if (!foundToken) {
    res.json({ error: "unauthorized 2" });
    return;
  }

  const valid = await argon2.verify(foundToken, token);

  if (!valid) {
    res.json({ error: "unauthorized 3" });
    return;
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email }).save();
  }

  await redis.del(email);

  req.session.userId = user.id;

  res.redirect(
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_URL
      : "http://localhost:3069"
  );
});

router.patch("/avatar", auth, async (req, res) => {
  var { url } = req.body;
  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ avatar: url })
      .where("id = :id", { id: req.session.userId })
      .execute();

    res.json("ok");
  } catch (e) {
    res.json("error");
  }
});

router.post("/logout", auth, async (req, res) => {
  req.session.destroy(async (e) => {
    if (e) {
      console.log(e);
    }

    res.clearCookie("kod");

    res.json("ok");
  });
});

export { router as UserRoute };
