import axios from "axios";
import { DOMAIN } from "../domain";

export const addAvatar = async ({ url }: { url: string }) => {
  const data = await axios.patch(
    `${DOMAIN}/api/v1/user/avatar`,
    {
      url,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};
