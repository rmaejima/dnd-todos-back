import { FastifyPluginAsync } from 'fastify';
import {
  TodoFinishRequest,
  TodoFinishRequestSchema,
  TodoPayload,
  TodoSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';

const root: FastifyPluginAsync = async (fastify) => {
  // Finish todo API
  fastify.put<{ Body: TodoFinishRequest; Reply: TodoPayload }>(
    '/',
    {
      schema: {
        body: TodoFinishRequestSchema,
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const todo = await prisma.todo.update({
        where: {
          id: request.body.id,
        },
        data: {
          finished: true,
        },
        include: {
          tags: true,
        },
      });
      // TODO: エラーハンドリング

      reply.send(serializeDateProps(todo));
    },
  );
};

export default root;
