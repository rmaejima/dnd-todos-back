import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../utils/prisma';
import {
  TodoCreateRequest,
  TodoCreateRequestSchema,
  TodoPayload,
  TodoSchema,
} from '../../types/todo';
import { serializeDateProps } from '../../utils/serializeDate';
import { Static, Type } from '@sinclair/typebox';

const TodoGetQuerySchema = Type.Object({
  finished: Type.ReadonlyOptional(Type.Boolean()),
  archived: Type.ReadonlyOptional(Type.Boolean()),
});
type TodoGetQuery = Static<typeof TodoGetQuerySchema>;

const root: FastifyPluginAsync = async (fastify) => {
  // Get all not archived todos API
  fastify.get<{
    Querystring: TodoGetQuery;
    Reply: TodoPayload[];
  }>(
    '/',
    {
      schema: {
        querystring: TodoGetQuerySchema,
        response: { 200: Type.Array(TodoSchema) },
      },
    },
    async (request, reply) => {
      console.log(request.query.finished);
      const todos = await prisma.todo.findMany({
        where: {
          finished: request.query.finished ?? false,
          archived: request.query.archived ?? false,
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
