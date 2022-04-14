import { Todo } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../utils/prisma';
import {
  TodoCreateRequest,
  TodoCreateRequestSchema,
  TodoPayload,
  TodoSchema,
} from '../../types/todo';
import { serializeDateProps } from '../../utils/serializeDate';
import { Type } from '@sinclair/typebox';

const root: FastifyPluginAsync = async (fastify) => {
  // Get all not archived todos API
  fastify.get<{
    Reply: TodoPayload[];
  }>(
    '/',
    {
      schema: {
        response: { 200: Type.Array(TodoSchema) },
      },
    },
    async (_, reply) => {
      const todos = await prisma.todo.findMany({
        where: {
          finished: false,
          archived: false,
        },
        include: {
          tags: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      const response = todos.map(serializeDateProps);
      reply.send(response);
    },
  );

  // Post todo API
  fastify.post<{
    Body: TodoCreateRequest;
    Reply: TodoPayload;
  }>(
    '/',
    {
      schema: {
        body: TodoCreateRequestSchema,
        response: { 200: TodoSchema },
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const todo = await prisma.todo.create({
        data: {
          title: reqBody.title,
          tags: {
            connect: reqBody.tags ?? [],
          },
        },
        include: {
          tags: true,
        },
      });
      // TODO: connection error のハンドリング

      reply.send(serializeDateProps(todo));
    },
  );
};

export default root;
