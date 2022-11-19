import { Photo } from "./Photo";

export interface Heart {
  id: number;
  userId: number;
  photoId: number;
  photo: Photo;
}
