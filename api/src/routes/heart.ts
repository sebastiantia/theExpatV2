import { Router } from "express";
import { Heart } from "../models/Heart";
import { getConnection } from "typeorm";
import { auth } from "../utils/auth";
import { Photo } from "../models/Photo";

const router = Router();

router.get("/all_hearted_photos", auth, async (_, res) => {
  const heartedPhotos = await getConnection()
    .createQueryBuilder(Heart, "heart")
    .leftJoinAndSelect("heart.photo", "photo")
    .where("heart.userId = :userId", {
      userId: res.locals.user.id,
    })
    .getMany();

  res.json(heartedPhotos);
});

router.get("/is_hearted/:id", async (req, res) => {
  const { id } = req.params;

  const photoId = parseInt(id);

  if (!req.session || !req.session.userId) {
    res.json({ heart: false });
    return;
  }

  let photo = await Heart.findOne({ userId: req.session.userId, photoId });

  if (!photo) {
    res.json({ heart: false });
    return;
  }

  res.json({ heart: true });
});

router.post("/heart_photo", auth, async (req, res) => {
  const { photoId } = req.body;

  // Check if user has hearted post
  const heart = await getConnection()
    .createQueryBuilder() 
    .select("heart")
    .from(Heart, "heart")
    .where("heart.photoId = :photoId and heart.userId = :userId", {
      photoId,
      userId: res.locals.user.id,
    })
    .getOne();

  if (!heart) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Heart)
      .values({
        userId: res.locals.user.id,
        photoId,
      })
      .returning("*")
      .execute();
    
    await getConnection()
      .createQueryBuilder()
      .update(Photo)
      .set({ heartcount: () => "heartcount + 1" })
      .where("id = :id", { id: photoId })
      .execute();

    res.json({ heart: true });
    return;
  }

  //if user has already hearted post
  await getConnection()
    .createQueryBuilder()
    .update(Photo)
    .set({ heartcount: () => "heartcount - 1" })
    .where("id = :id", { id: photoId })
    .execute();

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Heart)
    .where("photoId = :photoId and userId = :userId", {
      photoId,
      userId: res.locals.user.id,
    })
    .execute();

  res.json({ heart: false });
});

export { router as HeartRoute };
