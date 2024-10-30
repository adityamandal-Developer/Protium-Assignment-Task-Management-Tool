import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll(userId: string) {
    const where = {
      OR: [
        { userId }, // Condition for creatorId
        // { assigneeId: userId }, // Condition for assigneeId
      ],
    };

    return this.prisma.comment.findMany({
      where,
      include: {
        user: true, // Include related user
        task: true, // Include related task
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
