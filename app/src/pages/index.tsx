import { Box, Grid, Link, Text, Tooltip } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { Navbar } from "../components/Navbar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useVisibleHook } from "../lib/useVisibleHook";
import { requestPhotoHook } from "../lib/requestPhotoHook";
import { PhotoData } from "../lib/types/PhotoData";
import { UserResponse } from "../lib/types/UserResponse";
import { getWindowSizeHook } from "../lib/getWindowSizeHook";
import { getPaginatedPhotos } from "../lib/requests/getPaginatedPhotos";
import NextLink from "next/link";
import Head from "next/head";
import { me } from "../lib/requests/me";

interface IndexProps {
  user: UserResponse;
  photoData: PhotoData;
}

const Index: NextPage<IndexProps> = ({ user, photoData }) => {
  const [skip, setSkip] = useState<number>(0);

  const myref = useRef<HTMLInputElement>();

  //more symbolises there are more photos that can be requested
  const { photos, more } = requestPhotoHook(
    skip,
    photoData.photos,
    photoData.more
  );

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

  const isVisible = useVisibleHook(myref);

  useEffect(() => {
    if (isVisible && more) {
      setSkip(skip + 20);
    }
  }, [isVisible]);
  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Expat</title>
      </Head>
      <Navbar user={user.user} />
      <Box top={16}>
        <Grid
          px={4}
          w="full"
          templateRows="auto"
          templateColumns={templateColumns}
          gap={6}
          placeContent="start"
          placeItems="center"
        >
          {photos.map((photo, index) => (
            <Tooltip
              label={
                photo.caption.length >= 27
                  ? photo.caption.slice(0, 27).concat("...")
                  : photo.caption
              }
              hasArrow
            >
              <Box
                ref={photos.length - 1 === index ? myref : null}
                key={photo.id}
                position="relative"
                width={{ sm: "320px", image: "450px" }}
                height={{ sm: "270px", image: "380px" }}
              >
                <NextLink href={`/p/${photo.id}`} as={`/p/${photo.id}`}>
                  <Link>
                    <Image src={`${photo.url}-450x380`} layout="fill" />
                  </Link>
                </NextLink>
              </Box>
            </Tooltip>
          ))}
        </Grid>
        {more ? null : (
          <Box px={4} py="10" w="full">
            <Box
              borderTop="1px solid teal"
              display="flex"
              justifyContent="center"
            >
              <Text pt="5" fontSize="x-large">
                No more photos to show
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  ctx
): Promise<GetServerSidePropsResult<IndexProps>> => {
  const data = await me(ctx);
  
  const photoData = await getPaginatedPhotos({ skip: 0 });

  return {
    props: {
      user: data,
      photoData: photoData,
    },
  };
};

export default Index;
