import { FastifyPluginAsync } from 'fastify';
import { TodoPayload, TodoSchema } from '../../../../types/todo';
import { prisma } from '../../../../utils/prisma';
import { serializeDateProps } from '../../../../utils/serializeDate';

type BaseParamsDictionary = {
  todoId: string;
};

const root: FastifyPluginAsync = async (fastify) => {
  // Finish todo API
  fastify.post<{ Params: BaseParamsDictionary; Reply: TodoPayload }>(
    '/',
    {
      schema: {
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const todoId = Number(request.params.todoId);
      if (Number.isNaN(todoId)) {
        throw fastify.httpErrors.notFound('クラスがありません');
      }

      const todo = await prisma.todo.update({
        where: {
          id: todoId,
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
