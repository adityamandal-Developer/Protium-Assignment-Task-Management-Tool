// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        creatorId: userId,
      },
      include: {
        creator: true,
        assignee: true,
        team: true,
      },
    });
  }

  async findAll(filterDto: FilterTasksDto, userId: string) {
    const where = {
      OR: [{ creatorId: userId }, { assigneeId: userId }],
      AND: [],
    };

    if (filterDto.status) {
      where.AND.push({ status: filterDto.status });
    }

    if (filterDto.priority) {
      where.AND.push({ priority: filterDto.priority });
    }

    if (filterDto.dueDateBefore) {
      where.AND.push({ dueDate: { lte: new Date(filterDto.dueDateBefore) } });
    }

    if (filterDto.dueDateAfter) {
      where.AND.push({ dueDate: { gte: new Date(filterDto.dueDateAfter) } });
    }

    if (filterDto.search) {
      where.AND.push({
        OR: [
          { title: { contains: filterDto.search, mode: 'insensitive' } },
          { description: { contains: filterDto.search, mode: 'insensitive' } },
        ],
      });
    }

    return this.prisma.task.findMany({
      where,
      include: {
        creator: true,
        assignee: true,
        team: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ creatorId: userId }, { assigneeId: userId }],
      },
      include: {
        creator: true,
        assignee: true,
        team: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        creator: true,
        assignee: true,
        team: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async addComment(taskId: string, userId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        userId,
        taskId,
      },
      include: {
        user: true,
        task: true,
      },
    });
  }
}
