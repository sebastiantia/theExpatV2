import { Box, Grid, Image, Tooltip, Link } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getHeartedPhotos } from "../../lib/requests/getHeartedPhotos";
import { Heart } from "../../lib/types/Heart";
import { me } from "../../lib/requests/me";
import { User } from "../../lib/types/User";
import { getWindowSizeHook } from "../../lib/getWindowSizeHook";
import NextLink from "next/link";
import { Photo } from "../../lib/types/Photo";
interface HeartedProps {
  user: User;
}

const HeartedPhotos: NextPage<HeartedProps> = ({ user }) => {
  const [hearted, setHearted] = useState<Heart[]>([]);

  useEffect(() => {
    (async () => {
      const photoReturned = await getHeartedPhotos();

      setHearted(photoReturned);
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
    <Box minH="100vh">
      <Navbar user={user} />
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
        {hearted.map((heart) => (
          <Tooltip label={heart.photo.caption.slice(0, 30)} hasArrow>
            <Box
              key={heart.photo.id}
              position="relative"
              width={{ sm: "320px", image: "450px" }}
              height={{ sm: "270px", image: "380px" }}
            >
              <NextLink
                href={`/p/${heart.photo.id}`}
                as={`/p/${heart.photo.id}`}
              >
                <Link to={`/p/${heart.photo.id}`}>
                  <Image src={`${heart.photo.url}-450x380`} layout="fill" />
                </Link>
              </NextLink>
            </Box>
          </Tooltip>
        ))}
      </Grid>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<HeartedProps> = async (
  ctx
): Promise<GetServerSidePropsResult<HeartedProps>> => {
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

export default HeartedPhotos;
