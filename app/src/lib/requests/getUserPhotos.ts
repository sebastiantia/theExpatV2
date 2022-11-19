import axios from "axios";
import { DOMAIN } from "../domain";
import { Photo } from "../types/Photo";

export const getUserPhotos = async (): Promise<Photo[]> => {
  const { data } = await axios(`${DOMAIN}/api/v1/photos/get_user_photos`, {
    method: "GET",
    withCredentials: true,
  });

  return data;
};
