import axios from "axios";
import { DOMAIN } from "../domain";

export const isHearted = async ({ photoId }: { photoId: number }) => {
  const { data } = await axios.get(
    `${DOMAIN}/api/v1/heart/is_hearted/${photoId}`,
    {
      withCredentials: true,
    }
  );

  return data;
};
