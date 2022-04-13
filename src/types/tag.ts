import { Static, Type } from '@sinclair/typebox';

export const TagSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  color: Type.String(),
});
