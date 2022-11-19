import axios from "axios";
import { DOMAIN } from "../domain";

export const deletePhoto = async ({ id }: { id: number }) => {
  await axios.post(
    `${DOMAIN}/api/v1/photos/delete_photo`,
    {
      id,
    },
    {
      withCredentials: true,
    }
  );
};
