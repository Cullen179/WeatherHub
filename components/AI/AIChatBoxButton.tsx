'use client';

import { Bot } from 'lucide-react';
import { FC, useState } from 'react';

import AIChatBox from '../../app/AIChatBox';
import { Button } from '../ui/button';

const AIChatButton: FC<{}> = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setChatBoxOpen(true)}
        // tooltip="AI Chatbox"
        // Icon={Bot}
      />
      <AIChatBox
        open={chatBoxOpen}
        onClose={() => setChatBoxOpen(false)}
      />
    </>
  );
};

export default AIChatButton;
