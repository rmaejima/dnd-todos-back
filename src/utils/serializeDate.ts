type SerializeDate<T> = T extends Date ? string : T;
type SerializeDateObj<T> = {
  [P in keyof T]: T[P] extends Date
    ? SerializeDate<T[P]>
    : // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    T[P] extends Record<keyof any, any>
    ? SerializeDateObj<T[P]>
    : SerializeDate<T[P]>;
};

export const serializeDateProps = <T>(obj: T): SerializeDateObj<T> => {
  const serialized: Record<string, T[keyof T]> = {};
  for (const [key, value] of Object.entries(obj)) {
    serialized[key] = value instanceof Date ? value.toISOString() : value;
  }
  return serialized as SerializeDateObj<T>;
};
