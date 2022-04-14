import { FastifyPluginAsync } from 'fastify';
import { TodoPayload, TodoSchema } from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';

interface Body {
  id: number;
}

const root: FastifyPluginAsync = async (fastify) => {
  // Finish todo API
  fastify.post<{ Body: Body }>('/', async (request, reply) => {
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
  });
};

export default root;
