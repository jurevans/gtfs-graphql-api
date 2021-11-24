import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { FareAttributes } from 'entities/fare-attributes.entity';

@Index('payment_methods_pkey', ['paymentMethod'], { unique: true })
@Entity('payment_methods', { schema: 'gtfs' })
@ObjectType()
export class PaymentMethod {
  @Column('integer', { primary: true, name: 'payment_method' })
  @Field(() => Int)
  paymentMethod: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(
    () => FareAttributes,
    (fareAttributes) => fareAttributes.paymentMethod,
  )
  @Field(() => [FareAttributes])
  fareAttributes: FareAttributes[];
}
