import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginAsync } from 'fastify';
import {
  TodoPayload,
  TodoSchema,
  TodoUpdateRequest,
  TodoUpdateRequestSchema,
} from '../../../types/todo';
import { prisma } from '../../../utils/prisma';
import { serializeDateProps } from '../../../utils/serializeDate';

type BaseParamsDictionary = {
  todoId: number;
};

const index: FastifyPluginAsync = async (fastify) => {
  // Update todo API
  fastify.put<{
    Params: BaseParamsDictionary;
    Body: TodoUpdateRequest;
    Reply: TodoPayload;
  }>(
    '/',
    {
      schema: {
        body: TodoUpdateRequestSchema,
        response: {
          200: TodoSchema,
        },
      },
    },
    async (request, reply) => {
      const reqBody = request.body;
      const todoId = Number(request.params.todoId);
      if (Number.isNaN(todoId)) {
        throw fastify.httpErrors.notFound('TODOがありません');
      }

      const response = await prisma.todo
        .update({
          where: {
            id: todoId,
          },
          data: {
            title: reqBody.title,
            tags: {
              set: reqBody.tags ?? [],
            },
          },
          include: {
            tags: true,
          },
        })
        .catch((err) => {
          if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === 'P2025'
          ) {
            throw fastify.httpErrors.notFound('TODOがありません');
          }
          throw err;
        });

      reply.send(serializeDateProps(response));
    },
  );

  // Delete todo API
  fastify.delete<{
    Params: BaseParamsDictionary;
  }>('/', async (request, reply) => {
    const todoId = Number(request.params.todoId);
    if (Number.isNaN(todoId)) {
      throw fastify.httpErrors.notFound('TODOがありません');
    }

    await prisma.todo
      .delete({
        where: {
          id: todoId,
        },
      })
      .catch((err) => {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          throw fastify.httpErrors.notFound('TODOがありません');
        }
        throw err;
      });

    reply.send('TODOを削除しました');
  });
};

export default index;
