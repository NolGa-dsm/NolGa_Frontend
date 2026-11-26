export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : '요청 중 오류가 발생했습니다.'
