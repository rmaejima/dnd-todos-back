import { Static, Type } from '@sinclair/typebox';
import { nullable } from '../utils/typebox';
import { TagSchema } from './tag';

export const TodoSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  finished: Type.Boolean(),
  archived: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  tags: Type.Array(Type.Omit(TagSchema, ['todos'])),
});
export type TodoPayload = Static<typeof TodoSchema>;

export const TodoCreateRequestSchema = Type.Object({
  title: Type.String(),
  tags: nullable(Type.Array(Type.Object({ id: Type.Number() }))),
});
export type TodoCreateRequest = Static<typeof TodoCreateRequestSchema>;

export const TodoFinishRequestSchema = Type.Pick(TodoSchema, ['id']);
export type TodoFinishRequest = Static<typeof TodoFinishRequestSchema>;

export const TodoArchiveRequestSchema = TodoFinishRequestSchema;
export type TodoArchiveRequest = TodoFinishRequest;
