import { Column, Entity, Index, OneToMany } from 'typeorm';
import { FareAttributes } from './fare-attributes.entity';

@Index('payment_methods_pkey', ['paymentMethod'], { unique: true })
@Entity('payment_methods', { schema: 'gtfs' })
export class PaymentMethods {
  @Column('integer', { primary: true, name: 'payment_method' })
  paymentMethod: number;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @OneToMany(
    () => FareAttributes,
    (fareAttributes) => fareAttributes.paymentMethod,
  )
  fareAttributes: FareAttributes[];
}
