export function getErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) return data.detail.join(', ');
  const messages = [];
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) messages.push(`${key}: ${value.join(', ')}`);
    else if (typeof value === 'string') messages.push(value);
  });
  return messages.length ? messages.join(' | ') : fallback;
}
