export const extractName = (from) => {
  if (!from) return "";
  const match = from.match(/"?(.*?)"?\s*<.*@.*>/);
  return match ? match[1] : from;
};

// Truncate text and add ellipsis
export const truncateText = (text, maxLength) => {
  text = text || " ";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "…";
  }
  return text;
};