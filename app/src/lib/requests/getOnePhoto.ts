import axios from "axios";
import { DOMAIN } from "../domain";

export const getOnePhoto = async ({ id }: { id: number }) => {
  const { data } = await axios.get(
    `${DOMAIN}/api/v1/photos/get_one_photo/${id}`
  );

  return data;
};
