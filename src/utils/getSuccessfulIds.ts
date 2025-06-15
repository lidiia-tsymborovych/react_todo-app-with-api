export const getSuccessfulIds = <T>(
  results: PromiseSettledResult<T>[],
  relatedItems: { id: number }[],
) => {
  return results
    .map((result, i) =>
      result.status === 'fulfilled' ? relatedItems[i].id : null,
    )
    .filter((id): id is number => id !== null);
};
