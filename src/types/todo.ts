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
  tags: Type.Array(TagSchema),
});
export type TodoPayload = Static<typeof TodoSchema>;

export const TodoCreateRequestSchema = Type.Object({
  title: Type.String(),
  tags: nullable(Type.Array(Type.Object({ id: Type.Number() }))),
});
export type TodoCreateRequest = Static<typeof TodoCreateRequestSchema>;
