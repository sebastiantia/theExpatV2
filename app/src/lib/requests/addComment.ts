import axios from "axios";
import { DOMAIN } from "../domain";

export const addComment = async ({
  text,
  photoId,
}: {
  text: string;
  photoId: number;
}) => {
  const { data } = await axios.post(
    `${DOMAIN}/api/v1/comment/add_comment`,
    {
      text,
      photoId,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};
