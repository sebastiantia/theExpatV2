import aws from "aws-sdk";

interface EmailInfo {
  recipient: string;
  subject: string;
  body: string;
}

export const sendEmail = (
  info: EmailInfo
): Promise<aws.AWSError | aws.SES.SendEmailResponse> => {
  const ses = new aws.SES({
    apiVersion: "latest",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.ACCESS_SECRET,
    },
  });

  return new Promise((res, rej) => {
    ses.sendEmail(
      {
        Source: process.env.SENDER_EMAIL,
        Destination: {
          ToAddresses: [info.recipient],
        },
        Message: {
          Subject: {
            Data: info.subject,
          },
          Body: {
            Html: {
              Data: info.body,
            },
          },
        },
      },
      (e: aws.AWSError, response: aws.SES.SendEmailResponse) => {
        if (e) {
          rej(e);
        } else {
          res(response);
        }
      }
    );
  });
};
