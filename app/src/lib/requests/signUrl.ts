import axios from "axios";
import { DOMAIN } from "../domain";

export const signUrl = async ({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) => {
  const { data } = await axios.post(
    `${DOMAIN}/api/v1/photos/sign_url`,
    {
      fileName,
      fileType,
    },
    {
      withCredentials: true,
    }
  );

  return data;
};
