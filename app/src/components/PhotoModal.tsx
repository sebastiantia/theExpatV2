import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { deletePhoto } from "../lib/requests/deletePhoto";
import { editCaption } from "../lib/requests/editCaption";
import { Photo } from "../lib/types/Photo";

export const PhotoModal = ({
  open,
  onClose,
  photo,
  setPhoto,
}: {
  open: boolean;
  onClose: () => void;
  photo: Photo;
  setPhoto: Dispatch<SetStateAction<Photo>>;
}) => {
  const router = useRouter();
  const [editState, setEditState] = useState<boolean>(false);
  const [editVal, setEditVal] = useState<string>("");

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        if (editState) {
          setEditState(false);
        }
        onClose();
      }}
    >
      <ModalOverlay />

      <ModalContent>
        {editState ? <ModalCloseButton /> : null}
        <ModalBody d="flex" flexDirection="column" p="5">
          {editState ? (
            <Box>
              <Text mb="4">editing caption</Text>
              <Input
                placeholder="new caption"
                size="md"
                mb="8"
                onChange={(e) => {
                  setEditVal(e.target.value);
                }}
              />
              <Button
                width="full"
                colorScheme="teal"
                onClick={async () => {
                  if (editVal === "") {
                    return;
                  }

                  await editCaption({ photoId: photo.id, caption: editVal });

                  photo.caption = editVal;

                  setPhoto(photo);

                  setEditVal("");
                  onClose();
                }}
              >
                Submit changes
              </Button>
            </Box>
          ) : (
            <>
              <Button my="1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="yellow"
                my="1"
                onClick={() => {
                  setEditState(true);
                }}
              >
                Edit caption
              </Button>
              <Button
                colorScheme="red"
                my="1"
                onClick={async () => {
                  await deletePhoto({ id: photo.id });
                  router.push("/");
                }}
              >
                Delete photo
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
