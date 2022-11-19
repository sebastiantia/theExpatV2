import axios from "axios";
import { DOMAIN } from "../domain";

export const getHeartedPhotos = async () => {
  const { data } = await axios.get(
    `${DOMAIN}/api/v1/heart/all_hearted_photos`,
    {
      withCredentials: true,
    }
  );

  return data;
};
