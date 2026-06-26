import { appConfig } from '../config/appConfig';

export type StudioTemplate = {
  id: string;
  title: string;
  prompt: string;
};

export type BrandKit = {
  id: string;
  title: string;
  palette: string;
  tone: string;
  usage: string;
};

export type ImageConcept = {
  title: string;
  body: string;
  style: string;
};

export type CampaignCopyResult = {
  language: string;
  hook: string;
  body: string;
  cta: string;
};

function studioApiUrl(path: string) {
  const normalizedBase = appConfig.travelApiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function postStudioJson<TResponse>(path: string, body: Record<string, unknown> = {}): Promise<TResponse> {
  const response = await fetch(studioApiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? 'AI Studio request failed.');
  }

  return payload;
}

export async function getStudioTemplates() {
  const response = await postStudioJson<{ templates: StudioTemplate[] }>('/api/mobile/ai-studio/templates');
  return response.templates;
}

export async function getStudioBrandKits() {
  const response = await postStudioJson<{ brandKits: BrandKit[] }>('/api/mobile/ai-studio/brand-kits');
  return response.brandKits;
}

export async function generateStudioImageConcepts(input: { prompt: string; brandKitId?: string }) {
  const response = await postStudioJson<{ concepts: ImageConcept[] }>('/api/mobile/ai-studio/generate-image', input);
  return response.concepts;
}

export async function generateStudioCampaignCopy(input: { brief: string; audience: string; brandKitId?: string }) {
  const response = await postStudioJson<{ results: CampaignCopyResult[] }>('/api/mobile/ai-studio/generate-copy', input);
  return response.results;
}