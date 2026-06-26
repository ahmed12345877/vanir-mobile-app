import { apiUrl } from '../services/api';

export function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  }

  return apiUrl(trimmed);
}

export function pickFirstMediaUrl(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const resolved = resolveMediaUrl(value ?? null);

    if (resolved) {
      return resolved;
    }
  }

  return null;
}