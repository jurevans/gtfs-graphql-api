import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExceptionTypes } from 'entities/exception-types.entity';
import { Calendar } from 'entities/calendar.entity';

@Index('calendar_dates_dateidx', ['date'], {})
@Entity('calendar_dates', { schema: 'gtfs' })
@ObjectType()
export class CalendarDates {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: true })
  id: string;

  @Column('date', { name: 'date' })
  @Field({ nullable: true })
  date: string;

  @ManyToOne(
    () => ExceptionTypes,
    (exceptionTypes) => exceptionTypes.calendarDates,
  )
  @JoinColumn([
    { name: 'exception_type', referencedColumnName: 'exceptionType' },
  ])
  @Field(() => ExceptionTypes)
  exceptionType: ExceptionTypes;

  @ManyToOne(() => Calendar, (calendar) => calendar.calendarDates)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  @Field(() => Calendar)
  calendar: Calendar;
}
