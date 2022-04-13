import { Static, Type } from "@sinclair/typebox";
import { nullable } from "../utils/typbox";

export const TodoCreateRequestSchema = Type.Object({
  title: Type.String(),
  tags: nullable(Type.Array(Type.Object({ id: Type.Number() }))),
});
export type TodoCreateRequest = Static<typeof TodoCreateRequestSchema>;
