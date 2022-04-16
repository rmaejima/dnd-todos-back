import { prisma } from './prisma';

export const getTodoMaxOrder = async (): Promise<number | null> => {
  const maxOrder = await prisma.todo.aggregate({
    _max: {
      order: true,
    },
  });
  return maxOrder._max.order;
};

// カーソルより大きいOrderを全て-1する関数
export const decrementAllOrderLargerThanCursor = async (
  cursorOrder: number,
): Promise<void> => {
  await prisma.todo.updateMany({
    where: {
      order: {
        gt: cursorOrder,
      },
    },
    data: {
      order: {
        decrement: 1,
      },
    },
  });
};
