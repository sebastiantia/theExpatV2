import axios from "axios";
import { DOMAIN } from "../domain";

export const removeOthersComment = async ({
  commentId,
  photoId,
}: {
  commentId: number;
  photoId: number;
}) => {
  const data = await axios.post(
    `${DOMAIN}/api/v1/comment/remove_others_comment`,
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
