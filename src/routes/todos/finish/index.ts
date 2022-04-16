import { FastifyPluginAsync } from 'fastify';
import {
  TodoFinishRequest,
  TodoFinishRequestSchema,
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
      const reqBody = request.body;
      const maxOrder = await getTodoMaxOrder();

      //達成したTODOよりもOrderが大きいものを全て-1する
      const todo = await prisma.todo.findUnique({
        where: {
          id: reqBody.id,
        },
      });
      if (todo == null) {
        throw fastify.httpErrors.notFound('TODOがありません');
      }
      await decrementAllOrderLargerThanCursor(todo.order);

      // 達成したTODOのOrderは最後尾にする
      const updatedTodo = await prisma.todo.update({
        where: {
          id: reqBody.id,
        },
        data: {
          finished: true,
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
