import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../../utils/prisma';

type BaseParamsDictionary = {
  tagId: number;
};

const index: FastifyPluginAsync = async (fastify) => {
  // Delete tag API
  fastify.delete<{
    Params: BaseParamsDictionary;
  }>('/', async (request, reply) => {
    const tagId = Number(request.params.tagId);
    if (Number.isNaN(tagId)) {
      throw fastify.httpErrors.notFound('タグがありません');
    }

    await prisma.tag
      .delete({
        where: {
          id: tagId,
        },
      })
      .catch((err) => {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          throw fastify.httpErrors.notFound('タグがありません');
        }
        throw err;
      });

    reply.send('タグを削除しました');
  });
};

export default index;
