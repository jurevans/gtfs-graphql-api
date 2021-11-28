import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExceptionType } from 'entities/exception-type.entity';
import { Calendar } from 'entities/calendar.entity';

@Index('calendar_dates_dateidx', ['date'], {})
@Entity('calendar_dates', { schema: 'gtfs' })
@ObjectType()
export class CalendarDate {
  @PrimaryGeneratedColumn('uuid')
  @Column('uuid', { primary: true, name: 'calendar_dates_id' })
  @Field({ nullable: true })
  calendarDatesId: string;

  @Column('date', { name: 'date' })
  @Field({ nullable: true })
  date: string;

  @ManyToOne(
    () => ExceptionType,
    (exceptionType) => exceptionType.calendarDates,
  )
  @JoinColumn([
    { name: 'exception_type', referencedColumnName: 'exceptionType' },
  ])
  @Field(() => ExceptionType, { nullable: true })
  exceptionType: ExceptionType;

  @ManyToOne(() => Calendar, (calendar) => calendar.calendarDates)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  @Field(() => Calendar)
  calendar: Calendar;
}
