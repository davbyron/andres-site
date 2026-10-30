const MAX_LANGUAGE_LEVEL_ORDER = 20;

/** Default new levels to the end, falling back to an unused value at the Int limit. */
export function getNextLanguageLevelOrder(
  levels: readonly { order: number }[],
) {
  const orders = new Set(
    levels
      .map((level) => level.order)
      .filter(
        (order) => Number.isInteger(order) && order > 0 && order <= MAX_LANGUAGE_LEVEL_ORDER,
      ),
  );
  const nextOrder = Math.max(0, ...orders) + 1;
  if (nextOrder <= MAX_LANGUAGE_LEVEL_ORDER) return nextOrder;
  let availableOrder = 1;
  while (orders.has(availableOrder)) availableOrder++;
  return availableOrder;
}

/**
 * Reserve unused temporary Int values before assigning the submitted orders.
 * This allows swaps and reuse of deleted levels' positions without violating
 * the database's immediate unique constraint halfway through a transaction.
 */
export function getTemporaryLanguageLevelOrders(
  existingLevels: readonly { order: number }[],
  submittedLevels: readonly { order: number }[],
) {
  const occupiedOrders = new Set(
    [...existingLevels, ...submittedLevels].map((level) => level.order),
  );
  let temporaryOrder = -2_147_483_648;
  return existingLevels.map(() => {
    while (occupiedOrders.has(temporaryOrder)) temporaryOrder++;
    const reservedOrder = temporaryOrder++;
    occupiedOrders.add(reservedOrder);
    return reservedOrder;
  });
}
