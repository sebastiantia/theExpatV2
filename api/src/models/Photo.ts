import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Heart } from "./Heart";
import { User } from "./User";

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  caption: string;

  @Column()
  url: string;

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @Column({ default: 0 })
  heartcount: number;

  @OneToMany(() => Heart, (heart) => heart.photo)
  hearts: Heart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
