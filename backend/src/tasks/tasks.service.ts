import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Priority, Task, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { teamId, assigneeId, ...taskData } = createTaskDto;

    // Prepare the base task data
    const data: any = {
      ...taskData,
      creator: {
        connect: { id: userId },
      },
      // Convert string date to Date object if needed
      dueDate: new Date(createTaskDto.dueDate),
    };

    // Optionally connect team if teamId is provided
    if (teamId) {
      data.team = {
        connect: { id: teamId },
      };
    }

    // Optionally connect assignee if assigneeId is provided
    if (assigneeId) {
      data.assignee = {
        connect: { id: assigneeId },
      };
    }

    return this.prisma.task.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
    if (!content) {
      throw new NotAcceptableException('comment not provided');
    }
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

  async getTaskStats(userId: string) {
    // Get total tasks
    const totalTasks = await this.prisma.task.count({
      where: {
        OR: [{ creatorId: userId }, { assigneeId: userId }],
      },
    });

    // Get pending tasks (TODO + IN_PROGRESS)
    const pendingTasks = await this.prisma.task.count({
      where: {
        OR: [{ creatorId: userId }, { assigneeId: userId }],
        status: {
          in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
        },
      },
    });

    // Get completed tasks
    const completedTasks = await this.prisma.task.count({
      where: {
        OR: [{ creatorId: userId }, { assigneeId: userId }],
        status: TaskStatus.COMPLETED,
      },
    });

    // Get high priority tasks (HIGH + URGENT)
    const highPriorityTasks = await this.prisma.task.count({
      where: {
        OR: [{ creatorId: userId }, { assigneeId: userId }],
        priority: {
          in: [Priority.HIGH, Priority.URGENT],
        },
      },
    });

    return {
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks,
    };
  }
}
