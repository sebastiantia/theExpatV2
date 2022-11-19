import axios from "axios";
import { DOMAIN } from "../domain";

export const editCaption = async ({
  caption,
  photoId,
}: {
  caption: string;
  photoId: number;
}) => {
  const data = await axios.patch(
    `${DOMAIN}/api/v1/photos/edit_caption`,
    {
      caption,
      photoId,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};
