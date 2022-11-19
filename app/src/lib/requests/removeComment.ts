import axios from "axios";
import { DOMAIN } from "../domain";

export const removeComment = async ({
  commentId,
  photoId,
}: {
  commentId: number;
  photoId: number;
}) => {
  const data = await axios.post(
    `${DOMAIN}/api/v1/comment/remove_comment`,
    {
      commentId,
      photoId,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};
