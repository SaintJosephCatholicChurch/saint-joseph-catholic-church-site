export default function getContainerQuery(query: string, inCMS = true) {
  if (!inCMS) {
    return query;
  }

  return query.replace('@media', '@container page');
}
