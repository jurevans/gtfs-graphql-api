import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CalendarDate } from 'entities/calendar-date.entity';

@Index('exception_types_pkey', ['exceptionType'], { unique: true })
@Entity('exception_types', { schema: 'gtfs' })
@ObjectType()
export class ExceptionType {
  @Column('integer', { primary: true, name: 'exception_type' })
  @Field(() => Int)
  exceptionType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => CalendarDate, (calendarDate) => calendarDate.exceptionType)
  @Field(() => [CalendarDate])
  calendarDates: CalendarDate[];
}
