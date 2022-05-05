import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../utils/prisma';
import { Type } from '@sinclair/typebox';
import { Tag } from '@prisma/client';
import {
  TagCreateRequest,
  TagCreateRequestSchema,
  TagPayload,
  TagSchema,
} from '../../types/tag';

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
        // TODOと多く紐づいている順にソート
        orderBy: {
          todos: {
            _count: 'desc',
          },
        },
      });
      reply.send(allTags);
    },
  );

  // Create tag API
  fastify.post<{
    Body: TagCreateRequest;
    Reply: Tag;
  }>(
    '/',
    {
      schema: {
        body: TagCreateRequestSchema,
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const response = await prisma.tag.create({
        data: reqBody,
      });
      reply.send(response);
    },
  );
};

export default root;
