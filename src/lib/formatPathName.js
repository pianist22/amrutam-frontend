export function formatPathname(pathname) {
  if (!pathname) return [];

  // Remove any leading/trailing slashes and split by slash
  const parts = pathname.replace(/^\/|\/$/g, '').split('/');

  // Helper to capitalize each word in a string
  const capitalizeWords = str =>
    str
      .split(/[\s_]+/)               // Split by space or underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  // Map each part to capitalized format
  const formattedParts = parts.map(part => capitalizeWords(part));

  return formattedParts;
}
