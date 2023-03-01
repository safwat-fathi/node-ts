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
    throw new Error(`processQuery::${error}`);
  }
};

// export const processQuery = (query: Record<string, string>): string => {
//   const queryStringified = JSON.stringify(query);

//   return queryStringified.replace(
//     /\b(gte|lt|lte|gt|in)\b/gi,
//     match => `$${match}`
//   );
// };
