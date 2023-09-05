/**
 * Process query filter to match mongodb query operators
 * @param {object} query query basic filter
 * @returns {object} Returns mongodb query with filter operators
 */
export const processQuery = (
  query: Record<string, string> | null
): Record<string, any> | null => {
  try {
    if (!query) return null;

    const queryStringified = JSON.stringify(query);

    const queryProcessed = queryStringified.replace(
      /\b(search|text|gte|lt|lte|gt|in)\b/gi,
      match => `$${match}`
    );

    return JSON.parse(queryProcessed);
  } catch (error) {
    throw new Error(`Utils::mongoose::processQuery::${error}`);
  }
};
