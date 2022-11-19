import { Comment } from "./Comment";

export interface Photo {
  id: number;
  caption: string;
  url: string;
  userId: number;
  heartcount: number;
  comments?: Comment[];
}
