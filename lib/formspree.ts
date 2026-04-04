export const FORMSPREE_ENDPOINTS = {
  contact: process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '',
  schedule: process.env.NEXT_PUBLIC_FORMSPREE_SCHEDULE_ENDPOINT || '',
  enquiry: process.env.NEXT_PUBLIC_FORMSPREE_ENQUIRY_ENDPOINT || '',
  phone: process.env.NEXT_PUBLIC_FORMSPREE_PHONE_ENDPOINT || '',
} as const;

export type FormspreeEndpoint = keyof typeof FORMSPREE_ENDPOINTS;

export function resolveFormspreeEndpoint(value: string | undefined | null): string | null {
  if (!value) return null;

  const normalized = value.trim();
  if (!normalized) return null;

  const match = normalized.match(/formspree\.io\/f\/([a-z0-9]+)/i);
  if (match?.[1]) {
    return match[1];
  }

  if (normalized.startsWith('/f/')) {
    return normalized.slice(3);
  }

  if (/^[a-z0-9]+$/i.test(normalized)) {
    return normalized;
  }

  return null;
}

export async function submitToFormspree(
  endpoint: FormspreeEndpoint,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const endpointId = resolveFormspreeEndpoint(FORMSPREE_ENDPOINTS[endpoint]);

  if (!endpointId) {
    console.warn(`Formspree endpoint ${endpoint} not configured`);
    return { success: true };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${endpointId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true };
    }

    return { success: false, error: 'Failed to submit form' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
