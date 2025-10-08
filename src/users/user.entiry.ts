import { Expose } from 'class-transformer';
import { Task } from '../tasks/task.entiry';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @Expose()
  cleatedAt: Date;

  @UpdateDateColumn()
  @Expose()
  upratedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  @Expose()
  tasks: Task[];
}
