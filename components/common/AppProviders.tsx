'use client';

import { ReactNode } from 'react';
import { LenisProvider } from './LenisProvider';
import Footer from '../layout/Footer';
import Navbar from '../layout/Navbar';
import { ChatWidget } from '../chatbot/ChatWidget';
import { CallOptionsModal } from '../calling/CallOptionsModal';
import { ScheduleMeetingModal } from '../calling/ScheduleMeetingModal';
import { LiveCallModal } from '../calling/LiveCallModal';
import { PhoneSlideIn } from '../phone-capture/PhoneSlideIn';
import { PhoneExitIntent } from '../phone-capture/PhoneExitIntent';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LenisProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
      <CallOptionsModal />
      <ScheduleMeetingModal />
      <LiveCallModal />
      <PhoneSlideIn />
      <PhoneExitIntent />
    </LenisProvider>
  );
}
