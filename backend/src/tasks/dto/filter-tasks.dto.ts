import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDateBefore?: string;

  @IsOptional()
  @IsDateString()
  dueDateAfter?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
