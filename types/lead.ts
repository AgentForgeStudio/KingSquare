export interface LeadState {
  phone: string | null;
  name: string | null;
  email: string | null;
  phoneCapture: boolean;
  captureSource: string | null;
  capturedAt: string | null;
  setLead: (data: Partial<LeadState>) => void;
  markCaptured: (phone: string, source: string) => void;
  reset: () => void;
}

export interface PhoneCapturePayload {
  phone: string;
  source: string;
  pageUrl?: string;
  timestamp?: string;
}
