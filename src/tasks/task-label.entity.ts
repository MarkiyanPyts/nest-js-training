import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entiry';

@Entity()
@Unique(['name', 'taskId'])
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('')
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
