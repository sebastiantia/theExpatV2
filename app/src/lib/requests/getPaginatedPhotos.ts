import axios from "axios";
import { DOMAIN } from "../domain";

export const getPaginatedPhotos = async ({ skip }: { skip: number }) => {
  const { data } = await axios.post(
    `${DOMAIN}/api/v1/photos/get_paginated_photos`,
    {
      skip,
    }
  );

  return data;
};
