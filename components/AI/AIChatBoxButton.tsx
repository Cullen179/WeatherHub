'use client';

import { FC, useState } from 'react';
import AIChatBox from '../../app/AIChatBox';
import ActionIconButton from '../ui/ActionIconButton';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const AIChatButton: FC<{}> = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <ActionIconButton
        className={cn(
          'opacity-100 flex items-center justify-center w-12 h-12 shadow-lg rounded-full absolute bottom-4 right-4',
          chatBoxOpen ? 'hidden' : ''
        )}
        onClick={() => setChatBoxOpen(true)}
        tooltip="WeatherHub AI "
        tooltipDescription="find answer, weather knowledge , etc."
        Icon={Bot}
      />
      <AIChatBox
        open={chatBoxOpen}
        onClose={() => setChatBoxOpen(false)}
      />
    </>
  );
};

export default AIChatButton;
