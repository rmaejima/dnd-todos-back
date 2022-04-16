import { FastifyPluginAsync } from 'fastify';
import {
  TodoPayload,
  TodoSchema,
  TodoUndoRequest,
  TodoUndoRequestSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';

const root: FastifyPluginAsync = async (fastify) => {
  // Undo todo API
  fastify.put<{ Body: TodoUndoRequest; Reply: TodoPayload }>(
    '/',
    {
      schema: {
        body: TodoUndoRequestSchema,
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const todo = await prisma.todo.update({
        where: {
          id: request.body.id,
        },
        data: {
          finished: false,
          archived: false,
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
