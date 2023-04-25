export function formatNumber(num) {
  const formattedNumber = num.toLocaleString();
  if (num >= 1000 && num < 1000000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  if (num >= 1000000 && num < 1000000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(3)}B`;
  }
  if (num <= -1000 && num > -1000000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  if (num <= -1000000 && num > -1000000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num <= -1000000000) {
    return `${(num / 1000000000).toFixed(3)}B`;
  }

  return Math.floor(formattedNumber);
}
