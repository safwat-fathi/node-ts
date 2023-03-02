/**
 * Process query filter to match mongodb query operators
 * @param {object} query query basic filter
 * @returns {object} Returns mongodb query with filter operators
 */
export const processQuery = (
  query: Record<string, string>
): Record<string, string> => {
  try {
    const queryStringified = JSON.stringify(query);

    const queryProcessed = queryStringified.replace(
      /\b(gte|lt|lte|gt|in)\b/gi,
      match => `$${match}`
    );

    return JSON.parse(queryProcessed);
  } catch (error) {
    throw new Error(`Utils::processQuery::${error}`);
  }
};
