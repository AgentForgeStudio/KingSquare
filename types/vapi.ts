export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

export interface VapiCallState {
  status: CallStatus;
  isMuted: boolean;
  duration: number;
  volumeLevel: number;
  error: string | null;
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
}
