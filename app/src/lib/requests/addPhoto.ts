import axios from "axios";
import { DOMAIN } from "../domain";

export const addPhoto = async ({
  caption,
  url,
}: {
  caption: string;
  url: string;
}) => {
  const data = await axios.post(
    `${DOMAIN}/api/v1/photos/add_photo`,
    {
      caption,
      url,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};
