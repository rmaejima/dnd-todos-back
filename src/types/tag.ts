import { Static, Type } from '@sinclair/typebox';

export const TagSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  color: Type.String(),
  todos: Type.Array(Type.Object({ id: Type.Number() })),
});
export type TagPayload = Static<typeof TagSchema>;

export const TagCreateRequestSchema = Type.Pick(TagSchema, ['title', 'color']);
export type TagCreateRequest = Static<typeof TagCreateRequestSchema>;
