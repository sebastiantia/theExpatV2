import { Box, Grid, Image, Text, Tooltip, Link } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { getUserPhotos } from "../../lib/requests/getUserPhotos";
import { useEffect, useState } from "react";
import { Photo } from "../../lib/types/Photo";
import { Navbar } from "../../components/Navbar";
import { getWindowSizeHook } from "../../lib/getWindowSizeHook";
import NextLink from "next/link";
import Head from "next/head";
import { me } from "../../lib/requests/me";
import { User } from "../../lib/types/User";

interface IndexProps {
  user: User;
}

const YourPhotos: NextPage<IndexProps> = ({ user }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    (async () => {
      const photoReturned = await getUserPhotos();
      setPhotos(photoReturned);
    })();
  }, []);

  const { width, height } = getWindowSizeHook();

  const [templateColumns, setTemplateColumns] = useState("repeat(1, 1fr)");

  useEffect(() => {
    if (width < 900) {
      setTemplateColumns("repeat(1, 1fr)");
    } else if (width < 1400) {
      setTemplateColumns("repeat(2, 1fr)");
    } else if (width < 1900) {
      setTemplateColumns("repeat(3, 1fr)");
    } else {
      setTemplateColumns("repeat(4, 1fr)");
    }
  }, [width]);

  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Expat | your photos</title>
      </Head>
      <Navbar user={user} />
      <Box top={16}>
        <Grid
          px={4}
          w="full"
          templateRows="auto"
          templateColumns={templateColumns}
          gap={6}
          pb="20vh"
          placeContent="start"
          placeItems="center"
        >
          {photos.map((photo) => (
            <Tooltip label={photo.caption.slice(0, 30)} hasArrow>
              <Box
                key={photo.id}
                position="relative"
                width={{ sm: "320px", image: "450px" }}
                height={{ sm: "270px", image: "380px" }}
              >
                <NextLink href={`/p/${photo.id}`} as={`/p/${photo.id}`}>
                  <Link to={`/p/${photo.id}`}>
                    <Image src={`${photo.url}-450x380`} layout="fill" />
                  </Link>
                </NextLink>
              </Box>
            </Tooltip>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  ctx
): Promise<GetServerSidePropsResult<IndexProps>> => {
  const { user } = await me(ctx);

  if (!user) {
    ctx.res.writeHead(307, { location: "/" });
    ctx.res.end();
    return null;
  }

  return {
    props: {
      user,
    },
  };
};

export default YourPhotos;
