import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../../utils/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
  TagPayload,
  TagSchema,
  TagUpdateRequest,
  TagUpdateRequestSchema,
} from '../../../types/tag';

type BaseParamsDictionary = {
  tagId: number;
};

const index: FastifyPluginAsync = async (fastify) => {
  // Update tag API
  fastify.put<{
    Params: BaseParamsDictionary;
    Body: TagUpdateRequest;
    Reply: TagPayload;
  }>(
    '/',
    {
      schema: {
        body: TagUpdateRequestSchema,
        response: {
          200: TagSchema,
        },
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const tagId = Number(request.params.tagId);
      if (Number.isNaN(tagId)) {
        throw fastify.httpErrors.notFound('タグがありません');
      }

      const response = await prisma.tag
        .update({
          where: {
            id: tagId,
          },
          data: {
            title: reqBody.title,
            color: reqBody.color,
          },
          include: {
            todos: true,
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

      reply.send(response);
    },
  );

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
