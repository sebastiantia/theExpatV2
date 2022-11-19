import axios from "axios";
import { DOMAIN } from "../domain";

export const login = async ({ email }: { email: string }) => {
  const data = await axios.post(`${DOMAIN}/api/v1/user/login`, {
    email,
  });

  return data;
};
