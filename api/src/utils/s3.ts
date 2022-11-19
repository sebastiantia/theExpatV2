import aws from "aws-sdk";

interface ImageInfo {
  fileName: string;
  fileType: string;
}

export const getSignedUrl = async (info: ImageInfo) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_SECRET,
    region: "us-east-1",
    apiVersion: "latest",
    signatureVersion: "v4",
  });

  const fileName = `${Math.random()
    .toString(36)
    .substring(2, 20)}-${Date.now()}-${info.fileName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")}`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ACL: "public-read",
    ContentType: info.fileType,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    console.log(signedUrl)
    return {
      signedUrl,
      url: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      finalName: fileName,
    };
  } catch (e) {
    return e;
  }
};
