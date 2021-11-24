import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Transfers } from 'entities/transfers.entity';

@Index('transfer_types_pkey', ['transferType'], { unique: true })
@Entity('transfer_types', { schema: 'gtfs' })
@ObjectType()
export class TransferTypes {
  @Column('integer', { primary: true, name: 'transfer_type' })
  @Field(() => Int)
  transferType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Transfers, (transfers) => transfers.transferType)
  @Field(() => [Transfers])
  transfers: Transfers[];
}
