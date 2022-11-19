import { Router } from "express";
import { Photo } from "../models/Photo";
import { getSignedUrl } from "../utils/s3";
import { getConnection } from "typeorm";
import { auth } from "../utils/auth";

const router = Router();

router.patch("/edit_caption", auth, async (req, res) => {
  const { caption, photoId } = req.body;

  await getConnection()
    .createQueryBuilder()
    .update(Photo)
    .set({ caption })
    .where("id = :id", { id: photoId })
    .execute();

  res.json("ok");
});

router.get("/get_one_photo/:photoId", async (req, res) => {
  const { photoId } = req.params;

  const id = parseInt(photoId);

  try {
    const photo = await getConnection()
      .createQueryBuilder(Photo, "photo")
      .leftJoinAndSelect("photo.comments", "comment")
      .where("photo.id = :id", { id })
      .getOne();

    if (!photo) {
      res.json({ error: "photo does not exist" });
      return;
    }

    res.json(photo);
  } catch (e) {
    res.json({ error: JSON.stringify(e) });
    return;
  }
});

router.get("/get_user_photos", auth, async (_, res) => {
  const photos = await getConnection()
    .createQueryBuilder()
    .select("photo")
    .from(Photo, "photo")
    .where("photo.userId = :userId", { userId: res.locals.user.id })
    .getMany();

  res.json(photos);
});

router.post("/get_paginated_photos", async (req, res) => {
  const { skip } = req.body;

  const photos = await getConnection()
    .createQueryBuilder()
    .select("photo")
    .from(Photo, "photo")
    .orderBy("photo.createdAt", "DESC")
    .skip(skip)
    .take(21)
    .getMany();

  res.json({
    photos: photos.slice(0, 20),
    more: photos.length === 21,
  });
});

router.post("/sign_url", auth, async (req, res) => {
  const { fileName, fileType } = req.body;

  const data = await getSignedUrl({ fileName, fileType });

  res.json({ data });
});

router.post("/add_photo", auth, async (req, res) => {
  const { caption, url } = req.body;

  const result = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Photo)
    .values([{ caption, url, userId: res.locals.user.id }])
    .returning("*")
    .execute();

  const photo = result.raw[0];

  res.json({ photo });
});

router.post("/delete_photo", auth, async (req, res) => {
  const { id }: { id: number } = req.body;

  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Photo)
      .where("id = :id and userId = :userId", {
        id,
        userId: res.locals.user.id,
      })
      .execute();

    res.json("ok");
  } catch (e) {
    res.json({ error: JSON.stringify(e) });
  }
});

export { router as PhotoRoute };
