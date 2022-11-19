import axios from "axios";
import { DOMAIN } from "../domain";

export const heartPhoto = async ({ photoId }: { photoId: number }) => {
  await axios.post(
    `${DOMAIN}/api/v1/heart/heart_photo`,
    {
      photoId,
    },
    {
      withCredentials: true,
    }
  );
};
