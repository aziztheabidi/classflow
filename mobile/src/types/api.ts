export type PaginatedResult<T> = {
  items: T[];
  page: {
    limit: number;
    nextCursor: string | null;
  };
};
