import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { Navbar } from "../../components/Navbar";
import { UserResponse } from "../../lib/types/UserResponse";
import { Photo } from "../../lib/types/Photo";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { addComment } from "../../lib/requests/addComment";
import { heartPhoto } from "../../lib/requests/heartPhoto";
import { isHearted } from "../../lib/requests/isHearted";
import { removeComment } from "../../lib/requests/removeComment";
import { removeOthersComment } from "../../lib/requests/removeOthersComment";
import { BsTrash } from "react-icons/bs";
import { PhotoModal } from "../../components/PhotoModal";
import { FiSettings } from "react-icons/fi";
import { User } from "../../lib/types/User";
import Head from "next/head";
import { me } from "../../lib/requests/me";
import { getOnePhoto } from "../../lib/requests/getOnePhoto";
import { getWindowSizeHook } from "../../lib/getWindowSizeHook";

interface IndexProps {
  userResponse: UserResponse;
  photo: Photo;
}

const Index: NextPage<IndexProps> = ({ userResponse, photo }) => {
  const [heartState, setHeartState] = useState<boolean>(false);
  const [photoVal, setPhotoVal] = useState<Photo>(photo);
  const [user, setUser] = useState<User>(userResponse.user);
  const [comment, setComment] = useState<string>("");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    (async () => {
      const { heart } = await isHearted({ photoId: photo.id });

      setHeartState(heart);
    })();
  }, [user]);

  const [imgSrc, setImgSrc] = useState("-450x380");

  const { width } = getWindowSizeHook();

  useEffect(() => {
    if (width > 600) {
      setImgSrc("-800x620");
    }
  }, [width]);

  return (
    <Box minH="100vh" d="flex" justifyContent="center" w="100vw">
      <Head>
        <title>Expat | {photoVal.caption}</title>
      </Head>
      <Box maxW="1400px" position="relative">
        <Navbar user={user} setUser={setUser} />
        <Box
          d="flex"
          flexDirection={{ sm: "column", image: "column", xl: "row" }}
          top={16}
          px={4}
          justifyContent="center"
        >
          <Box
            position="relative"
            width={{ sm: `320px`, image: "480px", md: "600px", lg: "800px" }}
            height={{ sm: `260px`, image: "370px", md: "460px", lg: "620px" }}
          >
            <Image src={`${photo.url}${imgSrc}`} layout="fill" />
          </Box>
          <Box
            h={{ sm: "auto", xl: "620px" }}
            ml={{ sm: 0, xl: "8" }}
            mt={{ sm: 2, xl: 0 }}
            flexGrow={1}
            w={{
              sm: `${width}px`,
              image: "480px",
              md: "600px",
              lg: "800px",
              xl: "400px",
              "2xl": "600px",
            }}
            d="flex"
            flexDirection="column"
            border="1px black solid"
            borderRadius="8px"
            p="2"
          >
            <Box p={2} mb={2} borderBottom="1px solid black">
              <Box d="flex" flexDirection="row" alignItems="center">
                <Text fontSize="x-large" mr="auto">
                  {photoVal.caption.slice(0, 30)}
                </Text>
                <Button
                  leftIcon={<AiFillHeart />}
                  variant="solid"
                  colorScheme={heartState ? "pink" : "gray"}
                  onClick={async () => {
                    if (!user) {
                      return toast({
                        position: "top-left",
                        title: "Unauthorized",
                        description: "Please sign in to heart",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                    }

                    if (heartState) {
                      const dupe = { ...photoVal };
                      dupe.heartcount -= 1;

                      setPhotoVal(dupe);
                    } else {
                      const dupe = { ...photoVal };
                      dupe.heartcount += 1;

                      setPhotoVal(dupe);
                    }

                    await heartPhoto({ photoId: photo.id });

                    setHeartState(!heartState);
                  }}
                >
                  {photoVal.heartcount}
                </Button>
                {user ? (
                  <Box>
                    {user && photo.userId === user.id ? (
                      <IconButton
                        ml="2"
                        aria-label="edit modal"
                        colorScheme="teal"
                        onClick={async () => {
                          onOpen();
                        }}
                        icon={<FiSettings />}
                      />
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Box>

            <Box
              flexGrow={1}
              mb="auto"
              maxHeight={{ sm: "auto", lg: "500px" }}
              overflowY="auto"
            >
              {photoVal.comments.length === 0 ? (
                <Text p={2}>Add a comment!</Text>
              ) : null}
              {photoVal.comments.map((comment) => (
                <Box
                  w="full"
                  p={2}
                  key={comment.id}
                  d="flex"
                  alignItems="center"
                >
                  <Text mr="auto" fontWeight="medium" fontSize="medium">
                    {comment.text.slice(0, 30)}
                  </Text>
                  {user ? (
                    <Box>
                      {user.id === comment.userId ||
                      user.id === photo.userId ? (
                        <IconButton
                          colorScheme="red"
                          onClick={async () => {
                            const dupe = { ...photoVal };
                            const index = photoVal.comments.findIndex(
                              (c) => c.id === comment.id
                            );
                            dupe.comments.splice(index, 1);

                            setPhotoVal(dupe);

                            if (user.id === photo.userId) {
                              await removeOthersComment({
                                commentId: comment.id,
                                photoId: photo.id,
                              });
                              return;
                            }
                            if (user.id === comment.userId) {
                              await removeComment({
                                commentId: comment.id,
                                photoId: photo.id,
                              });
                            }
                          }}
                          aria-label="delete comment"
                          icon={<BsTrash />}
                        />
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
              ))}
            </Box>
            <PhotoModal
              open={isOpen}
              onClose={onClose}
              photo={photoVal}
              setPhoto={setPhotoVal}
            />
            <Box d="flex" flexDirection="row" alignItems="center">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="comment"
                  focusBorderColor="teal.400"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="2rem"
                    size="sm"
                    onClick={async () => {
                      if (!user) {
                        return toast({
                          position: "top-left",
                          title: "Unauthorized",
                          description: "Please sign in to comment",
                          status: "error",
                          duration: 9000,
                          isClosable: true,
                        });
                      }

                      if (comment === "") {
                        return;
                      }

                      const newComment = await addComment({
                        text: comment,
                        photoId: photo.id,
                      });

                      setComment("");

                      const previous = { ...photoVal };

                      previous.comments = [...photoVal.comments, newComment];

                      setPhotoVal(previous);
                    }}
                  >
                    post
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  ctx
): Promise<GetServerSidePropsResult<IndexProps>> => {
  const data = await me(ctx);

  const { photoId } = ctx.params;

  if (typeof photoId !== "string") {
    ctx.res.writeHead(307, { location: "/" });
    ctx.res.end();
    return null;
  }

  const id = parseInt(photoId);

  const photo = await getOnePhoto({ id });

  //DNE or otherwise
  if (photo.error) {
    ctx.res.writeHead(307, { location: "/" });
    ctx.res.end();
    return null;
  }

  return {
    props: {
      userResponse: data,
      photo,
    },
  };
};

export default Index;
