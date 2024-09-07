'use client';
import React from 'react';

import { Bot, User2 } from 'lucide-react';
import { Message } from 'ai/react';
import { cn } from '@/lib/utils';

export default function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, 'role' | 'content'>;
}) {
  const isAiMessage = role === 'assistant';

  return (
    <div
      className={cn(
        'mb-3 flex items-center text-sm',
        isAiMessage ? 'me-5 justify-start' : 'ms-5 justify-end'
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0 stroke-foreground" />}
      <p
        className={cn(
          'text-background px-4 py-2',
          !isAiMessage && 'rounded bg-foreground'
        )}
      >
        {content}
      </p>
    </div>
  );
}
