import { FastifyPluginAsync } from 'fastify';
import {
  TodoChangeOrderRequest,
  TodoChangeOrderRequestSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';

const root: FastifyPluginAsync = async (fastify) => {
  // Change todo order API
  fastify.put<{ Body: TodoChangeOrderRequest }>(
    '/',
    {
      schema: {
        body: TodoChangeOrderRequestSchema,
      },
    },
    async (request, reply) => {
      const { todos } = request.body;

      await Promise.all(
        todos.map(async (todo) => {
          await prisma.todo.update({
            where: {
              id: todo.id,
            },
            data: {
              order: todo.order,
            },
          });
        }),
      );

      reply.send('順番を変更しました');
    },
  );
};

export default root;
