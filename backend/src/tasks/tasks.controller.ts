// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: any) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@Query() filterDto: FilterTasksDto, @GetUser() user: any) {
    return this.tasksService.findAll(filterDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.remove(id, user.id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @GetUser() user: any,
  ) {
    return this.tasksService.addComment(id, user.id, content);
  }
}
