import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'texts' })
export class TextModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column()
  wordCount!: number;

  @Column()
  characterCount!: number;

  @Column()
  sentenceCount!: number;

  @Column()
  paragraphCount!: number;

  @Column()
  longestWord!: string;

  @Column()
  userId!: number;
}
