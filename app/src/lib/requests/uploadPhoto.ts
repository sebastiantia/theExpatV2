import axios from "axios";

export const uploadPhoto = async ({
  signedUrl,
  imageFile,
  type,
}: {
  signedUrl: string;
  imageFile: any;
  type: string;
}) => {
  const response = await axios.put(signedUrl, imageFile, {
    headers: {
      "Content-Type": type,
    },
    withCredentials: true,
  });

  return response;
};
