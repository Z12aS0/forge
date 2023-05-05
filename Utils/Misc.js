export function formatNumber(num) {
  if (num == undefined || num == null) {
    return 0
  }
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

  return Math.floor(num);
}
