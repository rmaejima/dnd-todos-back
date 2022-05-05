import { FastifyPluginAsync } from 'fastify';
import {
  TodoArchiveRequest,
  TodoArchiveRequestSchema,
  TodoPayload,
  TodoSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';
import {
  decrementAllOrderLargerThanCursor,
  getTodoMaxOrder,
} from '../../../utils/todo';

const root: FastifyPluginAsync = async (fastify) => {
  // Archive todo API
  fastify.put<{ Body: TodoArchiveRequest; Reply: TodoPayload }>(
    '/',
    {
      schema: {
        body: TodoArchiveRequestSchema,
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const maxOrder = await getTodoMaxOrder();

      //アーカイブされたTODOよりもOrderが大きいものを全て-1する
      const todo = await prisma.todo.findUnique({
        where: {
          id: reqBody.id,
        },
      });
      if (todo == null) {
        throw fastify.httpErrors.notFound('TODOがありません');
      }
      await decrementAllOrderLargerThanCursor(todo.order);

      // アーカイブされたTODOのOrderは最後尾にする
      const updatedTodo = await prisma.todo.update({
        where: {
          id: reqBody.id,
        },
        data: {
          archived: true,
          order: maxOrder ?? 1,
        },
        include: {
          tags: true,
        },
      });
      // TODO: エラーハンドリング

      reply.send(serializeDateProps(updatedTodo));
    },
  );
};

export default root;
