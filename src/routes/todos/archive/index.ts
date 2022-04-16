import { FastifyPluginAsync } from 'fastify';
import {
  TodoArchiveRequest,
  TodoArchiveRequestSchema,
  TodoPayload,
  TodoSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';

const root: FastifyPluginAsync = async (fastify) => {
  // Archive todo API
  fastify.post<{ Body: TodoArchiveRequest; Reply: TodoPayload }>(
    '/',
    {
      schema: {
        body: TodoArchiveRequestSchema,
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const todo = await prisma.todo.update({
        where: {
          id: request.body.id,
        },
        data: {
          archived: true,
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
