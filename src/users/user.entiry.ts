import { Task } from '../tasks/task.entiry';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  cleatedAt: Date;

  @UpdateDateColumn()
  upratedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
