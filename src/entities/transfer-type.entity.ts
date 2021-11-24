import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Transfer } from 'entities/transfer.entity';

@Index('transfer_types_pkey', ['transferType'], { unique: true })
@Entity('transfer_types', { schema: 'gtfs' })
@ObjectType()
export class TransferType {
  @Column('integer', { primary: true, name: 'transfer_type' })
  @Field(() => Int)
  transferType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Transfer, (transfer) => transfer.transferType)
  @Field(() => [Transfer])
  transfers: Transfer[];
}
