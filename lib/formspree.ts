const FORMSPREE_ENDPOINTS = {
  contact: process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '',
  schedule: process.env.NEXT_PUBLIC_FORMSPREE_SCHEDULE_ENDPOINT || '',
  enquiry: process.env.NEXT_PUBLIC_FORMSPREE_ENQUIRY_ENDPOINT || '',
  phone: process.env.NEXT_PUBLIC_FORMSPREE_PHONE_ENDPOINT || '',
} as const;

export type FormspreeEndpoint = keyof typeof FORMSPREE_ENDPOINTS;

export async function submitToFormspree(
  endpoint: FormspreeEndpoint,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const formspreeId = FORMSPREE_ENDPOINTS[endpoint];

  if (!formspreeId) {
    console.warn(`Formspree endpoint ${endpoint} not configured`);
    return { success: true };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
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
