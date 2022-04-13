import { Todo } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../utils/prisma';
import { TodoCreateRequest, TodoCreateRequestSchema } from '../../types/todo';

const root: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: TodoCreateRequest;
    Reply: Todo;
  }>(
    '/',
    {
      schema: {
        body: TodoCreateRequestSchema,
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const todo = await prisma.todo.create({
        data: {
          title: reqBody.title,
          tags: {
            connect: reqBody.tags ?? [],
          },
        },
        include: {
          tags: true,
        },
      });
      // TODO: connection error のハンドリング

      reply.send(todo);
    },
  );
};

export default root;
