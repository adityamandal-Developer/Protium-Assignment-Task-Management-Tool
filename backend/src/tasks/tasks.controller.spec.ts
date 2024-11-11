import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus, Priority } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask = {
    id: 'task-123',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    dueDate: new Date().toISOString(), // Convert to ISO string
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'user-123',
    assigneeId: 'user-456',
    teamId: 'team-789',
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2024-10-30T21:54:15.285Z',
    updatedAt: '2024-10-30T21:54:15.285Z',
  };

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date().toISOString(), // Convert to ISO string
        assigneeId: 'user-456',
        teamId: 'team-789',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto, mockUser);

      expect(result).toEqual(mockTask);
      expect(mockTasksService.create).toHaveBeenCalledWith({
        ...createTaskDto,
        creator: mockUser,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const filterDto: FilterTasksDto = {
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        search: 'test',
        dueDateBefore: '2024-12-31',
        dueDateAfter: '2024-01-01',
      };

      const tasks = [mockTask];
      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(filterDto, mockUser);

      expect(result).toEqual(tasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        filterDto,
        mockUser.id,
      );
    });

    it('should return all tasks when no filters provided', async () => {
      const emptyFilterDto: FilterTasksDto = {};
      const tasks = [mockTask];
      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(emptyFilterDto, mockUser);

      expect(result).toEqual(tasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        emptyFilterDto,
        mockUser.id,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockTask.id, mockUser);

      expect(result).toEqual(mockTask);
      expect(mockTasksService.findOne).toHaveBeenCalledWith(
        mockTask.id,
        mockUser.id,
      );
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne('nonexistent-id', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };
      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        mockTask.id,
        updateTaskDto,
        mockUser,
      );

      expect(result).toEqual(updatedTask);
      expect(mockTasksService.update).toHaveBeenCalledWith(
        mockTask.id,
        updateTaskDto,
        mockUser.id,
      );
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      const unauthorizedUser = { ...mockUser, id: 'unauthorized-user' };
      mockTasksService.update.mockRejectedValue(new ForbiddenException());

      await expect(
        controller.update(mockTask.id, updateTaskDto, unauthorizedUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTasksService.remove.mockResolvedValue(mockTask);

      const result = await controller.remove(mockTask.id, mockUser);

      expect(result).toEqual(mockTask);
      expect(mockTasksService.remove).toHaveBeenCalledWith(
        mockTask.id,
        mockUser.id,
      );
    });

    it('should throw ForbiddenException when user is not authorized to delete', async () => {
      const unauthorizedUser = { ...mockUser, id: 'unauthorized-user' };
      mockTasksService.remove.mockRejectedValue(new ForbiddenException());

      await expect(
        controller.remove(mockTask.id, unauthorizedUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
