import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  useToast,
  Image,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/router";
import Head from "next/head";
import { me } from "../../lib/requests/me";
import { User } from "../../lib/types/User";
import { addAvatar } from "../../lib/requests/addAvatar";
import { signUrl } from "../../lib/requests/signUrl";
import { uploadPhoto } from "../../lib/requests/uploadPhoto";
import { resize } from "../../lib/requests/resize";

interface AvatarProps {
  user: User;
}

const AvatarPage: NextPage<AvatarProps> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatar, setAvatar] = useState({ image: null });
  const router = useRouter();
  const toast = useToast();

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Box>
      <Head>
         <title>Photobomb | Your Avatar</title>
      </Head>
      <Navbar user={user} />
      <Box maxW="500px" px={10} py={5} margin="auto">
        <Heading mb={6}>Avatar photo</Heading>
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

            const imageFile = avatar.image;

            setLoading(true);

            e.preventDefault();

            const { data } = await signUrl({
              fileName: imageFile.name,
              fileType: imageFile.type,
            });

            const { signedUrl, url, finalName } = data;

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

            await addAvatar({ url });

            setLoading(false);

            await router.push("/");
          }}
        >
          <Image
            borderRadius="full"
            boxSize="100px"
            src={avatarPreview}
            _hover={{ border: "black 2px solid" }}
            alt="avatar"
            mb="20px"
          />
          <Box d="flex" flexDirection="row">
            <input
              required
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAvatar({ image: e.target.files[0] });
                handleChangeImage(e);
              }}
            />
          </Box>
          <Button
            mt={6}
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            loadingText="uploading..."
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<AvatarProps> = async (
  ctx
): Promise<GetServerSidePropsResult<AvatarProps>> => {
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

export default AvatarPage;
