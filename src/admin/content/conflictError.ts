export const CONTENT_CONFLICT_RETRY_MESSAGE =
  'This file was updated elsewhere. Your edits are kept. Save again to overwrite, or Reset to load the latest.';

export function isContentConflictError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes('updated elsewhere') || /(?:^|\D)409(?:\D|$)/.test(message) || /fast[- ]forward/i.test(message)
  );
}
