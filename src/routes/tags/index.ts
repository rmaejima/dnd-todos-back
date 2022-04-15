import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../utils/prisma';
import { Type } from '@sinclair/typebox';
import { Tag } from '@prisma/client';
import { TagPayload, TagSchema } from '../../types/tag';

const root: FastifyPluginAsync = async (fastify) => {
  // Get all tags API
  fastify.get<{
    Reply: TagPayload[];
  }>(
    '/',
    {
      schema: {
        response: { 200: Type.Array(TagSchema) },
      },
    },
    async (_, reply) => {
      const allTags = await prisma.tag.findMany({
        include: {
          todos: {
            select: {
              id: true,
            },
          },
        },
      });
      reply.send(allTags);
    },
  );
};

export default root;
