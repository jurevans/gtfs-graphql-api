import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CalendarDates } from 'entities/calendar-dates.entity';

@Index('exception_types_pkey', ['exceptionType'], { unique: true })
@Entity('exception_types', { schema: 'gtfs' })
@ObjectType()
export class ExceptionTypes {
  @Column('integer', { primary: true, name: 'exception_type' })
  @Field(() => Int)
  exceptionType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(
    () => CalendarDates,
    (calendarDates) => calendarDates.exceptionType,
  )
  @Field(() => [CalendarDates])
  calendarDates: CalendarDates[];
}
