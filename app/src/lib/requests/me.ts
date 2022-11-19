import axios from "axios";
import { DOMAIN } from "../domain";

export const me = async (ctx) => {
  const { data } = await axios.get(`${DOMAIN}/api/v1/user/me`, {
    headers: {
      cookie: ctx.req.headers.cookie ? ctx.req.headers.cookie : null,
    },
  });

  return data;
};
