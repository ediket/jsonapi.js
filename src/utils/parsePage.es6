export default function parsePage(pageData) {
  let startIndex = null;
  let endIndex = null;

  if (pageData.size !== undefined &&
      pageData.number !== undefined) {
    startIndex = pageData.size * (pageData.number - 1);
    endIndex = startIndex + pageData.size;
  }
  else if (pageData.start !== undefined &&
      pageData.end !== undefined) {
    startIndex = pageData.start;
    endIndex = pageData.end;
  }
  else if (pageData.offset !== undefined &&
      pageData.limit !== undefined) {
    startIndex = pageData.offset;
    endIndex = pageData.offset + pageData.limit;
  }

  if (startIndex === null || endIndex === null) {
    throw new Error('invalid pagination data!');
  }

  return { startIndex, endIndex };
}
