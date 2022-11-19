import axios from "axios";
import { DOMAIN } from "../domain";

export const logout = async () => {
  const data = await axios.post(`${DOMAIN}/api/v1/user/logout`, null, {
    withCredentials: true,
  });

  return data;
};
