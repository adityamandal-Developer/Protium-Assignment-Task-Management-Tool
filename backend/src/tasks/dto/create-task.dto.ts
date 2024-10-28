import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  dueDate: string;

  @IsUUID()
  teamId: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
