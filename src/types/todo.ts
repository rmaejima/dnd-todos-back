import { Static, Type } from "@sinclair/typebox";

export const TodoCreateRequestSchema = Type.Object({
  title: Type.String(),
  tags: Type.Object({
    title: Type.String(),
    color: Type.String(),
  }),
});
export type TodoCreateRequest = Static<typeof TodoCreateRequestSchema>;
