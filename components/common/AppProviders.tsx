'use client';

import { ReactNode } from 'react';
import { LenisProvider } from './LenisProvider';


import Footer from '../layout/Footer';
import { ChatWidget } from '../chatbot/ChatWidget';
import { CallOptionsModal } from '../calling/CallOptionsModal';
import { ScheduleMeetingModal } from '../calling/ScheduleMeetingModal';
import { PhoneSlideIn } from '../phone-capture/PhoneSlideIn';
import { PhoneExitIntent } from '../phone-capture/PhoneExitIntent';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LenisProvider>
{/* <Navbar/> */}
      <main>{children}</main>
      <Footer />
      <ChatWidget />
      <CallOptionsModal />
      <ScheduleMeetingModal />
      <PhoneSlideIn />
      <PhoneExitIntent />
    </LenisProvider>
  );
}
