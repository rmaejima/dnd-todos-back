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
import { getTodoMaxOrder } from '../../utils/todo';

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
      const todos = await prisma.todo.findMany({
        where: {
          finished: request.query.finished ?? false,
          archived: request.query.archived ?? false,
        },
        include: {
          tags: true,
        },
        orderBy: {
          order: 'asc',
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

      const maxOrder = await getTodoMaxOrder();

      const todo = await prisma.todo.create({
        data: {
          title: reqBody.title,
          order: maxOrder ? maxOrder + 1 : 1,
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
