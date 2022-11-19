import axios from "axios";

export const resize = async ({ key }: { key: string }) => {
  const data = await axios.post("/api/resize", {
    key,
  });

  return data;
};
