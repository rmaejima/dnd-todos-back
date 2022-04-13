import { Type, TSchema } from "@sinclair/typebox";

export const nullable = <T extends TSchema>(type: T) =>
  Type.Union([Type.Null(), type]);
