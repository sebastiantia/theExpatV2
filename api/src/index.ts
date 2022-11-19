import express from "express";
import { createConnection } from "typeorm";
import { Heart } from "./models/Heart";
import { Photo } from "./models/Photo";
import { User } from "./models/User";
import { Comment } from "./models/Comment";
import cors from "cors";
import session from "express-session"
import connectRedis from "connect-redis";
import { redis } from "./utils/redis";
import { PhotoRoute } from "./routes/photo";
import { UserRoute } from "./routes/user";
import { HeartRoute } from "./routes/heart";
import { CommentRoute } from "./routes/comment";
import "dotenv/config";

(async () => {
  const app = express();

  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [User, Photo, Heart, Comment],
  });

  app.set("trust proxy", 1);

  const RedisStore = connectRedis(session);

  app.use(express.json());

  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.PRODUCTION_URL
          : "http://localhost:3069",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "kod",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production"
            ? ".theexpat.me"
            : undefined,
      },
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      resave: false,
    })
  );

  app.use("/api/v1/heart", HeartRoute);
  app.use("/api/v1/user", UserRoute);
  app.use("/api/v1/photos", PhotoRoute);
  app.use("/api/v1/comment", CommentRoute);

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server on ${process.env.PORT}`);
  });
})().catch((err) => {
  console.error(err);
});
