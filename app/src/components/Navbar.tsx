import { StarIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { getWindowSizeHook } from "../lib/getWindowSizeHook";
import { login } from "../lib/requests/login";
import { logout } from "../lib/requests/logout";
import { User } from "../lib/types/User";

interface NavbarProps {
  user: User;

  setUser?: Dispatch<SetStateAction<User>>;
}

export const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [me, setMe] = useState<User>(user);

  const { width, height } = getWindowSizeHook();

  let desc: string = "";

  if (router.pathname === "/u/your-photos") {
    desc = "Your photos";
  } else if (router.pathname === "/u/hearted-photos") {
    desc = "Hearted photos";
  }

  return (
    <Box w="full" dispaly="static" h={24} mt={3}>
      <Box px={4} py={2} display="flex" alignItems="center">
        {desc ? (
          <>
            <Button
              variant="ghost"
              fontSize="6xl"
              colorScheme="teal"
              onClick={() => {
                router.push("/");
              }}
            >
              The Expat
            </Button>
            {width > 800 && router.pathname !== "/u/create-photo" ? (
              <Text ml="4" fontSize="x-large">
                {desc}
              </Text>
            ) : null}
          </>
        ) : (
          <Button
            variant="ghost"
            fontSize="6xl"
            colorScheme="teal"
            marginLeft="auto"
            onClick={() => {
              router.push("/");
            }}
          >
            The Expat
          </Button>
        )}

        <Box ml="auto">
          {me ? (
            <Menu>
              <MenuButton>
                <Image
                  borderRadius="full"
                  boxSize="70px"
                  src={`${user.avatar}-450x380`}
                  _hover={{ border: "black 2px solid" }}
                  alt="avatar"
                  onClick={() => {
                    router;
                  }}
                />
              </MenuButton>

              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push("/u/avatar");
                  }}
                >
                  Your avatar
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/u/create-photo");
                  }}
                >
                  Create photo
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/u/your-photos");
                  }}
                >
                  Your photos
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/u/hearted-photos");
                  }}
                >
                  Hearted photos
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    await logout();

                    if (
                      router.pathname === "/u/create-photo" ||
                      router.pathname === "/u/your-photos" ||
                      router.pathname === "/u/hearted-photos"
                    ) {
                      await router.push("/");
                    } else if (router.pathname === "/") {
                      setMe(null);
                    } else {
                      setUser(null);
                    }
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button onClick={onOpen} colorScheme="teal">
              Sign in
            </Button>
          )}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign in|up to Expat</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDirection="column">
            <Input
              placeholder="pineapples@gmail.com"
              size="lg"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              w="full"
              onClick={async () => {
                const emailRegex = /\S+@\S+\.\S+/;

                if (!emailRegex.test(email) || email === "") {
                  onClose();
                  return toast({
                    position: "top-left",
                    title: "Invalid email",
                    description: "Please enter a valid one.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                }

                await login({ email });

                onClose();

                toast({
                  position: "top-left",
                  title: "Emailed",
                  description: `A link has been sent to ${email}`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });

                setEmail("");
              }}
            >
              Continue with email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
