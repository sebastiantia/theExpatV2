import { Router } from "express";
import { Photo } from "../models/Photo";
import { getConnection } from "typeorm";
import { Comment } from "../models/Comment";
import { auth } from "../utils/auth";

const router = Router();

router.post("/add_comment", auth, async (req, res) => {
  const { text, photoId } = req.body;
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({ text, userId: res.locals.user.id, photoId })
      .returning("*")
      .execute();

    const comment = result.raw[0];
    res.json(comment);
  } catch (e) {
    res.json("error");
  }
});

router.post("/remove_comment", auth, async (req, res) => {
  const { commentId, photoId } = req.body;

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where("id = :commentId and userId = :userId", {
      commentId,
      userId: res.locals.user.id,
      photoId: photoId,
    })
    .execute();

  res.json("ok");
});

router.post("/remove_others_comment", auth, async (req, res) => {
  const { commentId, photoId } = req.body;

  const photo = await Photo.findOne({
    userId: res.locals.user.id,
    id: photoId,
  });

  if (!photo) {
    res.json("unauthorized");
    return;
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where("id = :commentId and photoId = :photoId", {
      commentId,
      photoId: photo.id,
    })
    .execute();

  res.json("ok");
});

export { router as CommentRoute };
