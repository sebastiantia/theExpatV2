import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Photo } from "./Photo";
import { User } from "./User";

@Entity()
export class Heart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  //foreign key
  photoId: number;

  @ManyToOne(() => User, (user) => user.hearts)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.hearts, {
    onDelete: "CASCADE",
  })
  photo: Photo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
