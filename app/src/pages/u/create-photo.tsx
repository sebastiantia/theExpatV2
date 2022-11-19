import { Box, Heading, Text, Button, Input, useToast } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/router";
import { signUrl } from "../../lib/requests/signUrl";
import { addPhoto } from "../../lib/requests/addPhoto";
import { resize } from "../../lib/requests/resize";
import { uploadPhoto } from "../../lib/requests/uploadPhoto";
import Head from "next/head";
import { me } from "../../lib/requests/me";
import { User } from "../../lib/types/User";

interface CreateProps {
  user: User;
}

const CreatePhoto: NextPage<CreateProps> = ({ user }) => {
  const [photo, setPhoto] = useState({ caption: "", image: null });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  return (
    <Box>
      <Head>
         <title>TheExpat | create photo</title>
      </Head>
      <Navbar user={user} />
      <Box maxW="500px" px={10} py={5} margin="auto">
        <Heading mb={6}>Create a photo</Heading>
        <form
          onSubmit={async (e) => {
            if (loading) {
              return toast({
                position: "top-left",
                title: "Error",
                description: "Quit the spam, friend",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
            const imageFile = photo.image;

            setLoading(true);

            e.preventDefault();
            //Hey I want to upload a file
            const { data } = await signUrl({
              fileName: imageFile.name,
              fileType: imageFile.type,
            });

            console.log(data);

            //SignedUrl is where to upload
            const { signedUrl, url, finalName } = data;

            //Upload photo with signedurl
            const { status } = await uploadPhoto({
              signedUrl,
              imageFile,
              type: imageFile.type,
            });

            if (status >= 400) {
              return toast({
                position: "top-left",
                title: "Upload failed",
                description: "Please try again",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }

            const { data: returned } = await resize({ key: finalName });
            //should not be possible
            if (returned === "err") {
              return;
            }

            await addPhoto({ caption: photo.caption, url });

            setLoading(false);

            await router.push("/");
          }}
        >
          <Box d="flex" flexDirection="column">
            <Text mb={2}>Caption</Text>
            <Input
              placeholder="caption"
              mb={5}
              onChange={(e) => {
                setPhoto({ caption: e.target.value, image: photo.image });
              }}
            />
            <input
              required
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setPhoto({ caption: photo.caption, image: e.target.files[0] });
              }}
            />
            <Button
              mt={6}
              type="submit"
              colorScheme="teal"
              isLoading={loading}
              loadingText="uploading..."
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<CreateProps> = async (
  ctx
): Promise<GetServerSidePropsResult<CreateProps>> => {
  const { user } = await me(ctx);

  if (!user) {
    ctx.res.writeHead(307, "/");
    ctx.res.end();
    return null;
  }

  return {
    props: {
      user,
    },
  };
};

export default CreatePhoto;
